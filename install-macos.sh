#!/usr/bin/env bash
#
# LockinRa for macOS — terminal installer.
#
#   curl -fsSL https://lockinra.xyz/install-macos.sh -o install-macos.sh
#   less install-macos.sh        # read it first
#   bash install-macos.sh
#
# WHY THIS EXISTS
#
# LockinRa is code-signed but not notarized by Apple — notarization needs a paid
# Developer Program membership. Gatekeeper therefore blocks it on first launch,
# and on macOS 15 (Sequoia) and later the old right-click → Open escape hatch is
# gone; you have to go through System Settings → Privacy & Security.
#
# The quarantine flag that triggers all of that is attached by the program doing
# the downloading, not by macOS. Browsers set it. curl does not. So downloading
# from a terminal avoids the warning entirely — there is nothing to override,
# because nothing was ever flagged.
#
# WHAT IT DOES
#
#   1. picks the build matching your chip (Apple silicon or Intel)
#   2. downloads it from the GitHub release over HTTPS
#   3. checks it against a SHA-256 published on lockinra.xyz — a different origin
#      from the download, so a tampered file on either one is caught
#   4. extracts with ditto (which preserves the code signature; unzip does not)
#   5. installs to /Applications and verifies the signature actually validates
#
# It never asks for sudo, never touches anything outside /Applications and a
# temp directory, and never disables Gatekeeper for anything else on your Mac.
#
# Options:  --force   replace an existing install without asking
#           --to DIR  install somewhere other than /Applications
#
set -euo pipefail

VERSION="1.8.0"
BASE="https://github.com/0xabhilok/lockinra-site/releases/download/v${VERSION}"

# SHA-256 of the .zip assets for v${VERSION}. Cross-check against SHA256SUMS.txt
# on the release page — these are served from lockinra.xyz, the files are served
# from github.com, and they have to agree.
SHA256_ARM64="e98047558a63233f8e2d728772cf533d669626d3a8849adfc81e4a90db3969ba"
SHA256_X64="83a015585270c701677948c32a232cf753cd90ea005d4474b278af28b881570e"

DEST="/Applications"
FORCE=0
while [ $# -gt 0 ]; do
  case "$1" in
    --force) FORCE=1; shift ;;
    --to) DEST="${2:?--to needs a directory}"; shift 2 ;;
    -h|--help) sed -n '2,35p' "$0"; exit 0 ;;
    *) echo "unknown option: $1" >&2; exit 2 ;;
  esac
done

say()  { printf '\033[0;32m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[0;33m==>\033[0m %s\n' "$*" >&2; }
die()  { printf '\033[0;31m==>\033[0m %s\n' "$*" >&2; exit 1; }

[ "$(uname -s)" = "Darwin" ] || die "This installer is for macOS. See https://lockinra.xyz/download.html"

# Apple silicon reports x86_64 from inside Rosetta, so uname alone is not enough:
# a shell translated by Rosetta would send an Apple silicon Mac the Intel build.
arch="$(uname -m)"
if [ "$arch" != "arm64" ] && [ "$(sysctl -n sysctl.proc_translated 2>/dev/null || echo 0)" = "1" ]; then
  arch="arm64"
fi

case "$arch" in
  arm64)  ASSET="LockinRa-${VERSION}-mac-arm64.zip"; WANT="$SHA256_ARM64"; CHIP="Apple silicon" ;;
  x86_64) ASSET="LockinRa-${VERSION}-mac-x64.zip";   WANT="$SHA256_X64";   CHIP="Intel" ;;
  *)      die "Unsupported architecture: $arch" ;;
esac

case "$WANT" in
  __SHA256_*) die "This script was published without its checksums filled in. Please report it: https://lockinra.xyz/support.html" ;;
esac

APP="$DEST/LockinRa.app"
if [ -e "$APP" ] && [ "$FORCE" -ne 1 ]; then
  if [ ! -t 0 ]; then
    die "$APP already exists. Re-run with --force to replace it."
  fi
  printf '==> %s already exists. Replace it? [y/N] ' "$APP"
  read -r reply
  case "$reply" in [yY]*) ;; *) die "Cancelled. Nothing was changed." ;; esac
fi

TMP="$(mktemp -d)"
# Clean up on any exit, including a failure partway through — a half-downloaded
# 300MB zip left in /tmp is nobody's idea of a good install experience.
trap 'rm -rf "$TMP"' EXIT

say "LockinRa ${VERSION} for ${CHIP}"
say "Downloading ${ASSET}…"
curl -fL --progress-bar "${BASE}/${ASSET}" -o "$TMP/$ASSET" \
  || die "Download failed. Check your connection, or grab it from https://lockinra.xyz/download.html"

say "Verifying checksum…"
got="$(shasum -a 256 "$TMP/$ASSET" | awk '{print $1}')"
if [ "$got" != "$WANT" ]; then
  die "Checksum mismatch — NOT installing.
    expected  $WANT
    got       $got
  Do not use this file. Please report it: https://lockinra.xyz/support.html"
fi

say "Extracting…"
# ditto, not unzip: unzip drops the extended attributes and symlink structure a
# signed .app bundle depends on, and the result fails codesign verification.
ditto -xk "$TMP/$ASSET" "$TMP/out" || die "Extraction failed."
SRC="$TMP/out/LockinRa.app"
[ -d "$SRC" ] || die "The archive did not contain LockinRa.app."

say "Installing to ${DEST}…"
mkdir -p "$DEST"
rm -rf "$APP"
mv "$SRC" "$APP" || die "Could not write to ${DEST}. Try: --to \"\$HOME/Applications\""

# Belt and braces. curl does not set the quarantine flag, so there should be
# nothing here to remove — but if this script was itself fetched and run through
# something that did, this is what keeps the install warning-free.
xattr -dr com.apple.quarantine "$APP" 2>/dev/null || true

say "Verifying the code signature…"
if codesign --verify --deep --strict "$APP" 2>/dev/null; then
  say "Signature is valid."
else
  warn "The signature did not verify. The app is installed, but that is not expected —"
  warn "please report it at https://lockinra.xyz/support.html"
fi

say "Done. Open it with:  open -a LockinRa"
say "It is in your Applications folder and in Launchpad."

// @lockinra/embeddings — the classification cascade (ADR 0016 §4). The single,
// pure decision procedure that turns "what is this activity, given the current
// task?" into a category + confidence + provenance, cheapest-stage-first:
//
//   1. HARD RULES        instant, deterministic (domain/app allow/block lists)
//   2. CORRECTION kNN     the user's OWN past corrections — personalization
//   3. TITLE LEXICONS     cheap keyword signal on the page/window title
//   4. LLM                only for genuine novelty (the expensive path)
//   5. FALLBACK           unknown @ confidence 0 (silent; caller degrades)
//
// Every stage is an INJECTED seam (async where needed): this module owns the
// order + the kNN math (similarity floor, recency-weighted agreement vote), not
// the model, the DB, or the rules. That keeps it pure and exhaustively testable,
// and lets the desktop wiring (A5) supply real rules / embeddings / neighbours /
// LLM without this package importing any of them.
//
// Cold-start honesty (ADR 0016 §4): with zero corrections stage 2 is empty and
// behaviour reduces to rules → lexicon → LLM (i.e. today's behaviour). The
// system is "learning your patterns", never fabricating confidence it lacks.

import { topK, type VectorEntry } from './vector.js';

export type CascadeCategory =
  | 'productive'
  | 'neutral'
  | 'distracting'
  | 'unknown';

export type CascadeSource = 'rule' | 'knn' | 'lexicon' | 'llm' | 'fallback';

export interface CascadeResult {
  readonly category: CascadeCategory;
  readonly confidence: number; // 0..1
  readonly source: CascadeSource;
  readonly reason: string;
}

/** The activity + task context a classification reasons over. */
export interface CascadeInput {
  readonly taskTitle?: string | null;
  readonly workType?: string | null;
  readonly appName?: string | null;
  readonly domain?: string | null;
  readonly url?: string | null;
  readonly title?: string | null;
  readonly windowTitle?: string | null;
}

/** A query vector tagged with the backend that produced it. */
export interface CascadeQuery {
  readonly backend: string;
  readonly vector: Float32Array;
}

/** A user-corrected example: its label + its (backend-matched) vector. Passed
 * most-recent-first so recency weighting can favour newer corrections. */
export interface CascadeNeighbor {
  readonly category: CascadeCategory;
  readonly backend: string;
  readonly vector: Float32Array;
}

export interface CascadeSeams {
  /** Stage 1. Return a decisive result, or null to defer to later stages. */
  rules?: (input: CascadeInput) => CascadeResult | null;
  /** Build the text embedded for kNN. A sensible default is used when omitted. */
  buildKey?: (input: CascadeInput) => string;
  /** Embed the kNN key. Return null when no backend is available (skip kNN). */
  embed?: (text: string) => Promise<CascadeQuery | null>;
  /** The user's corrected examples for the given backend (most-recent-first). */
  neighbors?: (backend: string) => Promise<readonly CascadeNeighbor[]>;
  /** Stage 3. Return a category from the title lexicon, or null. */
  lexicon?: (input: CascadeInput) => CascadeCategory | null;
  /** Stage 4. The LLM classifier. */
  llm?: (input: CascadeInput) => Promise<CascadeResult>;
}

export interface CascadeOptions {
  /** How many nearest corrections to consider. Default 5. */
  readonly knnK?: number;
  /** A neighbour must clear this cosine similarity to count. Default 0.75. */
  readonly knnMinSimilarity?: number;
  /** The winning category must hold at least this share of the (weighted) vote
   * for kNN to be trusted. Default 0.6. */
  readonly knnAgreement?: number;
  /** Weight nearer-in-time corrections more heavily. Default true. */
  readonly recencyWeighted?: boolean;
  /** Confidence attached to a title-lexicon hit. Default 0.65 — a deliberate
   * keyword match is fairly confident, and this keeps it above a downstream
   * low-confidence popup threshold. */
  readonly lexiconConfidence?: number;
}

const DEFAULTS = {
  knnK: 5,
  knnMinSimilarity: 0.75,
  knnAgreement: 0.6,
  recencyWeighted: true,
  lexiconConfidence: 0.65,
} as const;

export function defaultBuildKey(input: CascadeInput): string {
  return [
    input.taskTitle ? `task: ${input.taskTitle}` : '',
    input.workType ? `work: ${input.workType}` : '',
    input.title ?? input.windowTitle ?? '',
    input.domain ? `site: ${input.domain}` : (input.url ?? ''),
    input.appName ? `app: ${input.appName}` : '',
  ]
    .filter((p) => p.length > 0)
    .join(' | ');
}

const FALLBACK: CascadeResult = {
  category: 'unknown',
  confidence: 0,
  source: 'fallback',
  reason: 'no classifier available',
};

interface Voted {
  readonly category: CascadeCategory;
  readonly rank: number;
}

/**
 * Run the cascade. Stages are tried in order; the first confident one wins.
 * Never throws — an LLM failure degrades to the fallback (silent) result, so a
 * flaky classifier can never break the caller (mirrors the ai router's posture).
 */
export async function classifyCascade(
  input: CascadeInput,
  seams: CascadeSeams,
  options: CascadeOptions = {},
): Promise<CascadeResult> {
  const knnK = options.knnK ?? DEFAULTS.knnK;
  const knnMinSimilarity = options.knnMinSimilarity ?? DEFAULTS.knnMinSimilarity;
  const knnAgreement = options.knnAgreement ?? DEFAULTS.knnAgreement;
  const recencyWeighted = options.recencyWeighted ?? DEFAULTS.recencyWeighted;

  // 1. Hard rules.
  if (seams.rules) {
    const ruled = seams.rules(input);
    if (ruled) return ruled;
  }

  // 2. Correction kNN (personalization). Skipped entirely if any seam is
  // missing or embedding is unavailable — the cold-start / degraded path.
  if (seams.embed && seams.neighbors) {
    const key = (seams.buildKey ?? defaultBuildKey)(input);
    const query = await seams.embed(key);
    if (query) {
      const neighbors = await seams.neighbors(query.backend);
      const knn = voteKnn(query, neighbors, {
        knnK,
        knnMinSimilarity,
        knnAgreement,
        recencyWeighted,
      });
      if (knn) return knn;
    }
  }

  // 3. Title lexicon.
  if (seams.lexicon) {
    const cat = seams.lexicon(input);
    if (cat) {
      return {
        category: cat,
        confidence: options.lexiconConfidence ?? DEFAULTS.lexiconConfidence,
        source: 'lexicon',
        reason: 'title keyword signal',
      };
    }
  }

  // 4. LLM (only reached for genuine novelty).
  if (seams.llm) {
    try {
      return await seams.llm(input);
    } catch {
      return FALLBACK;
    }
  }

  // 5. Fallback — silent.
  return FALLBACK;
}

interface KnnOpts {
  knnK: number;
  knnMinSimilarity: number;
  knnAgreement: number;
  recencyWeighted: boolean;
}

function voteKnn(
  query: CascadeQuery,
  neighbors: readonly CascadeNeighbor[],
  opts: KnnOpts,
): CascadeResult | null {
  if (neighbors.length === 0) return null;

  const entries: VectorEntry<Voted>[] = neighbors.map((n, rank) => ({
    item: { category: n.category, rank },
    backend: n.backend,
    vector: n.vector,
  }));

  const scored = topK({ backend: query.backend, vector: query.vector }, entries, opts.knnK, {
    minScore: opts.knnMinSimilarity,
  });
  if (scored.length === 0) return null;

  const topScore = scored[0]?.score ?? 0;

  // Weighted vote: each surviving neighbour contributes similarity × recency.
  const weights = new Map<CascadeCategory, number>();
  let total = 0;
  for (const s of scored) {
    const recency = opts.recencyWeighted ? 1 / (1 + s.item.rank) : 1;
    const w = s.score * recency;
    weights.set(s.item.category, (weights.get(s.item.category) ?? 0) + w);
    total += w;
  }

  let winner: CascadeCategory | null = null;
  let winWeight = -1;
  for (const [cat, w] of weights) {
    if (w > winWeight) {
      winWeight = w;
      winner = cat;
    }
  }

  const agreement = total > 0 ? winWeight / total : 0;
  if (!winner || agreement < opts.knnAgreement) return null;

  return {
    category: winner,
    confidence: topScore,
    source: 'knn',
    reason: `matched ${scored.length} of your past corrections`,
  };
}

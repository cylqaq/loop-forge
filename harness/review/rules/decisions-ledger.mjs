import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const name = 'decisions-ledger';

const HOT = 'docs/DECISIONS.md';
const COLD_DIR = 'docs/decisions';
/** Align with context-budget.yaml decisions.hot_path_max_kb */
const HOT_MAX_BYTES = 8 * 1024;
/** Align with context-budget.yaml decisions.per_entry_max_kb */
const COLD_MAX_BYTES = 4 * 1024;

/** @param {string} raw */
function normId(raw) {
  const m = String(raw).toUpperCase().match(/^D-(\d+)$/);
  if (!m) return null;
  return `D-${String(m[1]).padStart(3, '0')}`;
}

/**
 * Decision Ledger gate (D-023): hot INDEX small; cold ADR 1:1 with table rows.
 * @param {string} root
 */
export function run(root) {
  const hotPath = join(root, HOT);
  if (!existsSync(hotPath)) {
    return { ok: false, message: `Missing hot ledger: ${HOT}` };
  }

  const hotStat = statSync(hotPath);
  if (hotStat.size > HOT_MAX_BYTES) {
    return {
      ok: false,
      message: `${HOT} is ${hotStat.size} bytes (max ${HOT_MAX_BYTES}); split into docs/decisions/`,
    };
  }

  const hot = readFileSync(hotPath, 'utf8');
  if (/^## D-\d+ ·/m.test(hot)) {
    return {
      ok: false,
      message: `${HOT} still contains full ADR headings (## D-NNN ·); move bodies to ${COLD_DIR}/`,
    };
  }

  const claimed = [
    ...new Set(
      [...hot.matchAll(/\|\s*(D-\d+)\s*\|/g)]
        .map((m) => normId(m[1]))
        .filter(Boolean),
    ),
  ];

  const coldDir = join(root, COLD_DIR);
  if (!existsSync(coldDir)) {
    if (claimed.length === 0) return { ok: true };
    return {
      ok: false,
      message: `Missing cold dir ${COLD_DIR}/ but hot table lists ${claimed.join(', ')}`,
    };
  }

  const coldById = new Map();
  for (const f of readdirSync(coldDir)) {
    if (!/^D-\d+-.+\.md$/i.test(f)) continue;
    const id = normId(f.match(/^(D-\d+)/i)[1]);
    if (coldById.has(id)) {
      return { ok: false, message: `Duplicate cold ADR for ${id}: ${coldById.get(id)} and ${f}` };
    }
    coldById.set(id, f);

    const size = statSync(join(coldDir, f)).size;
    if (size > COLD_MAX_BYTES) {
      return { ok: false, message: `${COLD_DIR}/${f} is ${size} bytes (max ${COLD_MAX_BYTES})` };
    }
  }

  for (const id of claimed) {
    if (!coldById.has(id)) {
      return { ok: false, message: `Hot table lists ${id} but no ${COLD_DIR}/${id}-*.md` };
    }
  }

  for (const [id, file] of coldById) {
    if (!claimed.includes(id)) {
      return { ok: false, message: `Cold file ${file} not indexed in ${HOT}` };
    }
  }

  return { ok: true };
}

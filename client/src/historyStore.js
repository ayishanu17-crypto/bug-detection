// Lightweight browser cache for scan history.
// Every successful scan is stored locally so the scanned code stays visible
// in the history view even when MongoDB (or the backend) is unavailable.

const HISTORY_KEY = 'debugique-scan-history';
const MAX_LOCAL = 50;

export function getLocalHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalHistory(entries) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(entries.slice(0, MAX_LOCAL)));
  } catch {
    /* storage full or unavailable — ignore */
  }
}

export function saveLocalScan(scan) {
  const next = [scan, ...getLocalHistory()];
  writeLocalHistory(next);
  return next;
}

// Combine database entries with locally-cached entries, dropping exact
// duplicates, and return them newest-first.
export function mergeHistory(serverEntries, localEntries) {
  const byKey = new Map();

  // A server record and a local fallback of the same scan share a key.
  const keyOf = (entry) =>
    `${String(entry.codeSnippet)}|${entry.language || 'javascript'}|${entry.totalIssues}`;

  for (const entry of serverEntries) byKey.set(keyOf(entry), entry);
  for (const entry of localEntries) {
    if (!byKey.has(keyOf(entry))) byKey.set(keyOf(entry), entry);
  }

  return [...byKey.values()]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, MAX_LOCAL);
}
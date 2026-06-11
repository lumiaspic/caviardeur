// @ts-check

/**
 * @typedef {import("./detect/types.js").Match} Match
 */

/**
 * Une entrée de la table de correspondance.
 *
 * @typedef {Object} TableEntry
 * @property {string} token  Le jeton de remplacement, ex. "[EMAIL_1]".
 * @property {string} type   La catégorie.
 * @property {string} value  La valeur d'origine.
 */

/**
 * Résultat de l'anonymisation.
 *
 * @typedef {Object} AnonymizeResult
 * @property {string} text                Le texte caviardé.
 * @property {TableEntry[]} table         La table de correspondance.
 */

/**
 * Trie les occurrences et écarte les chevauchements.
 * Stratégie : par position de début, puis on préfère la plus longue. On garde
 * les occurrences qui ne chevauchent pas une déjà retenue.
 *
 * @param {Match[]} matches
 * @returns {Match[]}
 */
function resolveOverlaps(matches) {
  const sorted = [...matches].sort((a, b) => a.start - b.start || b.end - a.end);
  /** @type {Match[]} */
  const kept = [];
  let lastEnd = -1;
  for (const m of sorted) {
    if (m.start >= lastEnd) {
      kept.push(m);
      lastEnd = m.end;
    }
  }
  return kept;
}

/**
 * Remplace les occurrences détectées par des jetons explicites et cohérents :
 * une même (catégorie, valeur) reçoit toujours le même jeton.
 *
 * @param {string} text
 * @param {Match[]} matches
 * @returns {AnonymizeResult}
 */
export function anonymize(text, matches) {
  const kept = resolveOverlaps(matches);

  /** @type {Map<string, string>} clé "TYPE\0valeur" -> jeton */
  const tokenByKey = new Map();
  /** @type {Map<string, number>} compteur par type */
  const counters = new Map();
  /** @type {TableEntry[]} */
  const table = [];

  /** @param {Match} m */
  function tokenFor(m) {
    const key = `${m.type}\0${m.value}`;
    const existing = tokenByKey.get(key);
    if (existing) return existing;
    const n = (counters.get(m.type) ?? 0) + 1;
    counters.set(m.type, n);
    const token = `[${m.type}_${n}]`;
    tokenByKey.set(key, token);
    table.push({ token, type: m.type, value: m.value });
    return token;
  }

  // Reconstruction du texte en parcourant les occurrences retenues dans l'ordre.
  let out = "";
  let cursor = 0;
  for (const m of kept) {
    out += text.slice(cursor, m.start);
    out += tokenFor(m);
    cursor = m.end;
  }
  out += text.slice(cursor);

  return { text: out, table };
}

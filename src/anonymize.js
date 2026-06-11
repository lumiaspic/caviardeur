// @ts-check

/**
 * @typedef {import("./detect/types.js").Match} Match
 * @typedef {import("./detect/types.js").Reliability} Reliability
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
 * @property {string} text                 Le texte caviardé.
 * @property {TableEntry[]} table          La table de correspondance (appliqués).
 * @property {Match[]} suggestions         Occurrences ambiguës proposées, non
 *                                         appliquées tant qu'elles ne sont pas
 *                                         validées (cf. `accepted`).
 * @property {boolean} bracketCollision    Le texte d'origine contient déjà des
 *                                         crochets « [ » ou « ] » : les jetons
 *                                         insérés pourraient s'y confondre.
 */

/**
 * Rang de priorité par fiabilité : plus petit = plus prioritaire.
 * @type {Record<Reliability, number>}
 */
const RELIABILITY_RANK = { reliable: 0, noisy: 1, ambiguous: 2 };

/**
 * Identifiant stable d'une occurrence, pour suivre une suggestion validée côté
 * UI. Inclut la position pour distinguer deux occurrences de même valeur.
 *
 * @param {Match} m
 * @returns {string}
 */
export function matchKey(m) {
  return `${m.type}\0${m.value}\0${m.start}\0${m.end}`;
}

/**
 * Trie les occurrences et écarte les chevauchements, **en tenant compte de la
 * priorité** : à chevauchement, la plus fiable l'emporte ; à fiabilité égale,
 * la plus longue ; puis la plus précoce. Une occurrence sans fiabilité est
 * traitée comme "reliable" (rétrocompatibilité).
 *
 * @param {Match[]} matches
 * @returns {Match[]}  Occurrences retenues, triées par position.
 */
function resolveOverlaps(matches) {
  const byPriority = [...matches].sort((a, b) => {
    const ra = RELIABILITY_RANK[a.reliability ?? "reliable"];
    const rb = RELIABILITY_RANK[b.reliability ?? "reliable"];
    if (ra !== rb) return ra - rb;
    const lenDiff = b.end - b.start - (a.end - a.start);
    if (lenDiff !== 0) return lenDiff;
    return a.start - b.start;
  });

  /** @type {Match[]} */
  const kept = [];
  for (const m of byPriority) {
    const overlaps = kept.some((k) => m.start < k.end && k.start < m.end);
    if (!overlaps) kept.push(m);
  }

  // La reconstruction du texte attend les occurrences dans l'ordre de lecture.
  kept.sort((a, b) => a.start - b.start);
  return kept;
}

/**
 * Remplace les occurrences détectées par des jetons explicites et cohérents :
 * une même (catégorie, valeur) reçoit toujours le même jeton.
 *
 * Sont **appliqués** les détecteurs fiables ("reliable") et bruités ("noisy"),
 * ainsi que les suggestions ambiguës explicitement **validées** (`accepted`).
 * Les autres occurrences ambiguës sont laissées telles quelles dans le texte et
 * renvoyées dans `suggestions` pour que l'UI les propose.
 *
 * @param {string} text
 * @param {Match[]} matches
 * @param {Set<string>} [accepted]  Clés (`matchKey`) des suggestions validées.
 * @returns {AnonymizeResult}
 */
export function anonymize(text, matches, accepted = new Set()) {
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

  /**
   * Une occurrence est appliquée si elle n'est pas ambiguë, ou si l'utilisateur
   * a validé cette suggestion.
   * @param {Match} m
   */
  function isApplied(m) {
    return m.reliability !== "ambiguous" || accepted.has(matchKey(m));
  }

  // Reconstruction : on remplace les occurrences appliquées, on laisse les
  // suggestions non validées intactes dans le texte.
  let out = "";
  let cursor = 0;
  for (const m of kept) {
    if (!isApplied(m)) continue;
    out += text.slice(cursor, m.start);
    out += tokenFor(m);
    cursor = m.end;
  }
  out += text.slice(cursor);

  const suggestions = kept.filter((m) => m.reliability === "ambiguous");

  return { text: out, table, suggestions, bracketCollision: /[[\]]/.test(text) };
}

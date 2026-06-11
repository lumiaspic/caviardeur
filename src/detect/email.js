// @ts-check

/**
 * @typedef {import("./types.js").Match} Match
 */

/**
 * Détecte les adresses e-mail.
 *
 * Détecteur structuré fiable (✅) : appliqué d'office, très peu de faux positifs.
 *
 * @param {string} text
 * @returns {Match[]}
 */
export function detectEmails(text) {
  /** @type {Match[]} */
  const matches = [];
  // Regex volontairement simple et lisible (auditable). On reste conservateur :
  // mieux vaut rater un format exotique que sur-détecter.
  const re = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g;
  for (const m of text.matchAll(re)) {
    const value = m[0];
    const start = /** @type {number} */ (m.index);
    matches.push({ start, end: start + value.length, value, type: "EMAIL" });
  }
  return matches;
}

// @ts-check

/**
 * Une occurrence détectée dans le texte.
 *
 * @typedef {Object} Match
 * @property {number} start  Index de début (inclus) dans le texte.
 * @property {number} end    Index de fin (exclu) dans le texte.
 * @property {string} value  Sous-chaîne détectée.
 * @property {string} type   Catégorie, ex. "EMAIL", "PERSONNE", "VILLE".
 */

/**
 * Un détecteur : prend le texte, renvoie les occurrences trouvées.
 *
 * @typedef {(text: string) => Match[]} Detector
 */

// Ce module ne contient que des types (JSDoc). Pas d'export runtime nécessaire.
export {};

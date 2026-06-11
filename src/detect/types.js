// @ts-check

/**
 * Niveau de fiabilité d'un détecteur (cf. docs/detection.md).
 *
 * - "reliable" (✅)  : appliqué d'office, peu ou pas de faux positifs.
 * - "noisy" (🟡)     : appliqué mais sur-détecte ; facilement corrigible.
 * - "ambiguous" (🟠) : **proposé en suggestion**, jamais imposé silencieusement.
 *
 * @typedef {"reliable" | "noisy" | "ambiguous"} Reliability
 */

/**
 * Une occurrence détectée dans le texte.
 *
 * Le champ `reliability` n'est PAS rempli par les détecteurs eux-mêmes : il est
 * apposé par `runDetectors` à partir du niveau déclaré dans le registre. Il est
 * donc optionnel sur le type, mais toujours présent sur les occurrences sorties
 * de `runDetectors`.
 *
 * @typedef {Object} Match
 * @property {number} start  Index de début (inclus) dans le texte.
 * @property {number} end    Index de fin (exclu) dans le texte.
 * @property {string} value  Sous-chaîne détectée.
 * @property {string} type   Catégorie, ex. "EMAIL", "PERSONNE", "VILLE".
 * @property {Reliability} [reliability]  Fiabilité, apposée par `runDetectors`.
 */

/**
 * Un détecteur : prend le texte, renvoie les occurrences trouvées (sans
 * fiabilité ; celle-ci est ajoutée par le registre).
 *
 * @typedef {(text: string) => Match[]} Detector
 */

/**
 * Une entrée du registre : un détecteur et le niveau de fiabilité sous lequel
 * ses occurrences seront traitées.
 *
 * @typedef {Object} DetectorEntry
 * @property {Detector} detect            La fonction de détection.
 * @property {Reliability} reliability    Fiabilité appliquée à ses occurrences.
 */

// Ce module ne contient que des types (JSDoc). Pas d'export runtime nécessaire.
export {};

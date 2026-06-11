// @ts-check

/**
 * @typedef {import("./types.js").Match} Match
 */

/**
 * Détecteur de personnes — **démonstration de Phase 0** de la voie « suggestion
 * ambiguë ».
 *
 * Repère un nom propre précédé d'un titre de civilité (« M. Dupont »,
 * « Mme Martin », « Dr Roy »…). Volontairement conservateur : il exige le
 * déclencheur de civilité, ce qui limite les faux positifs. Il ne capture que
 * le nom (pas le titre).
 *
 * Fiabilité : **ambiguë** (déclarée dans le registre) → proposé en suggestion,
 * jamais appliqué d'office. À élargir en Phase 3 (prénoms/noms INSEE,
 * désambiguïsation par contexte). Voir docs/detection.md.
 *
 * @param {string} text
 * @returns {Match[]}
 */
export function detectPersons(text) {
  /** @type {Match[]} */
  const matches = [];
  // Titre de civilité, puis un mot capitalisé (la première lettre est une
  // majuscule Unicode). On capture le nom dans le groupe 1.
  const re = /\b(?:M\.|MM\.|Mme|Mlle|Dr|Pr)\s+(\p{Lu}[\p{L}'-]+)/gu;
  for (const m of text.matchAll(re)) {
    const name = m[1];
    if (!name) continue;
    // `name` se trouve à la fin du motif complet : on recule depuis la fin.
    const start = /** @type {number} */ (m.index) + m[0].length - name.length;
    matches.push({ start, end: start + name.length, value: name, type: "PERSONNE" });
  }
  return matches;
}

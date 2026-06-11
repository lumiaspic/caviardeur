// @ts-check

import { detectEmails } from "./email.js";
import { detectPersons } from "./person.js";

/**
 * @typedef {import("./types.js").Match} Match
 * @typedef {import("./types.js").DetectorEntry} DetectorEntry
 */

/**
 * Registre des détecteurs actifs, chacun avec sa fiabilité.
 *
 * La fiabilité décide du traitement en aval (cf. `src/anonymize.js`) :
 * - "reliable" / "noisy" → appliqués d'office ;
 * - "ambiguous"          → **proposés en suggestion**, jamais imposés.
 *
 * `detectPersons` est, pour l'instant, un détecteur ambigu de **démonstration**
 * (Phase 0) : il valide la chaîne « suggestion à valider » de bout en bout. Il
 * sera élargi en Phase 3 (dictionnaires INSEE + désambiguïsation).
 *
 * @type {DetectorEntry[]}
 */
export const detectors = [
  { detect: detectEmails, reliability: "reliable" },
  { detect: detectPersons, reliability: "ambiguous" },
];

/**
 * Exécute tous les détecteurs sur le texte et agrège leurs occurrences, en
 * apposant à chacune la fiabilité déclarée dans le registre.
 * La résolution des chevauchements est faite plus loin, à l'anonymisation.
 *
 * @param {string} text
 * @returns {Match[]}
 */
export function runDetectors(text) {
  return detectors.flatMap(({ detect, reliability }) =>
    detect(text).map((m) => ({ ...m, reliability })),
  );
}

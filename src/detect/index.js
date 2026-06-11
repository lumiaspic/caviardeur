// @ts-check

import { detectEmails } from "./email.js";

/**
 * @typedef {import("./types.js").Match} Match
 * @typedef {import("./types.js").Detector} Detector
 */

/**
 * Registre des détecteurs actifs.
 *
 * À mesure que de nouveaux détecteurs sont ajoutés (téléphone, IBAN, etc.), on
 * les enregistre ici. Les détecteurs ambigus (prénom, ville…) seront marqués
 * comme « suggestions » plutôt qu'appliqués d'office — distinction à introduire
 * quand ils arriveront.
 *
 * @type {Detector[]}
 */
export const detectors = [detectEmails];

/**
 * Exécute tous les détecteurs sur le texte et agrège leurs occurrences.
 * La résolution des chevauchements est faite plus loin, à l'anonymisation.
 *
 * @param {string} text
 * @returns {Match[]}
 */
export function runDetectors(text) {
  return detectors.flatMap((detect) => detect(text));
}

// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import { anonymize, matchKey } from "../src/anonymize.js";

/** @typedef {import("../src/detect/types.js").Match} Match */

test("remplace une occurrence par un jeton et alimente la table", () => {
  const text = "Mail : a@b.fr";
  const matches = [{ start: 7, end: 13, value: "a@b.fr", type: "EMAIL" }];
  const { text: out, table } = anonymize(text, matches);
  assert.equal(out, "Mail : [EMAIL_1]");
  assert.deepEqual(table, [{ token: "[EMAIL_1]", type: "EMAIL", value: "a@b.fr" }]);
});

test("cohérence : une même valeur reçoit le même jeton partout", () => {
  const text = "a@b.fr puis a@b.fr";
  const matches = [
    { start: 0, end: 6, value: "a@b.fr", type: "EMAIL" },
    { start: 12, end: 18, value: "a@b.fr", type: "EMAIL" },
  ];
  const { text: out, table } = anonymize(text, matches);
  assert.equal(out, "[EMAIL_1] puis [EMAIL_1]");
  assert.equal(table.length, 1);
});

test("numérote les valeurs distinctes d'un même type", () => {
  const matches = [
    { start: 0, end: 6, value: "a@b.fr", type: "EMAIL" },
    { start: 10, end: 16, value: "c@d.fr", type: "EMAIL" },
  ];
  const { text: out } = anonymize("a@b.fr et c@d.fr", matches);
  assert.equal(out, "[EMAIL_1] et [EMAIL_2]");
});

test("écarte les chevauchements en préférant la plus longue occurrence", () => {
  const text = "abcdef";
  const matches = [
    { start: 0, end: 3, value: "abc", type: "X" },
    { start: 0, end: 5, value: "abcde", type: "Y" },
  ];
  const { table } = anonymize(text, matches);
  assert.equal(table.length, 1);
  assert.equal(table[0].value, "abcde");
});

test("priorité : un détecteur fiable l'emporte sur une suggestion qui chevauche", () => {
  const text = "abcdef";
  // L'ambiguë est plus longue, mais la fiable est plus prioritaire.
  /** @type {Match[]} */
  const matches = [
    { start: 0, end: 5, value: "abcde", type: "VILLE", reliability: "ambiguous" },
    { start: 1, end: 4, value: "bcd", type: "EMAIL", reliability: "reliable" },
  ];
  const { table, suggestions } = anonymize(text, matches);
  assert.equal(table.length, 1);
  assert.equal(table[0].type, "EMAIL");
  // L'ambiguë chevauchait la fiable retenue : elle est écartée, pas proposée.
  assert.equal(suggestions.length, 0);
});

test("les occurrences ambiguës sont proposées, pas appliquées d'office", () => {
  const text = "M. Dupont";
  /** @type {Match[]} */
  const matches = [
    { start: 3, end: 9, value: "Dupont", type: "PERSONNE", reliability: "ambiguous" },
  ];
  const { text: out, table, suggestions } = anonymize(text, matches);
  assert.equal(out, "M. Dupont"); // texte inchangé
  assert.equal(table.length, 0); // rien dans la table
  assert.equal(suggestions.length, 1);
  assert.equal(suggestions[0].value, "Dupont");
});

test("une suggestion validée est appliquée", () => {
  const text = "M. Dupont";
  /** @type {Match} */
  const m = { start: 3, end: 9, value: "Dupont", type: "PERSONNE", reliability: "ambiguous" };
  const accepted = new Set([matchKey(m)]);
  const { text: out, table } = anonymize(text, [m], accepted);
  assert.equal(out, "M. [PERSONNE_1]");
  assert.equal(table.length, 1);
  assert.equal(table[0].value, "Dupont");
});

test("collision de crochets : drapeau levé quand le texte contient déjà des [ ]", () => {
  /** @type {Match[]} */
  const withMatches = [
    { start: 11, end: 17, value: "a@b.fr", type: "EMAIL", reliability: "reliable" },
  ];
  const withBrackets = anonymize("voir [note] et a@b.fr", withMatches);
  assert.equal(withBrackets.bracketCollision, true);

  /** @type {Match[]} */
  const withoutMatches = [
    { start: 5, end: 11, value: "a@b.fr", type: "EMAIL", reliability: "reliable" },
  ];
  const without = anonymize("voir a@b.fr", withoutMatches);
  assert.equal(without.bracketCollision, false);
});

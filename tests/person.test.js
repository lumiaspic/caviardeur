// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import { detectPersons } from "../src/detect/person.js";

test("détecte un nom précédé d'une civilité", () => {
  const matches = detectPersons("Reçu par M. Dupont hier.");
  assert.equal(matches.length, 1);
  assert.equal(matches[0].value, "Dupont");
  assert.equal(matches[0].type, "PERSONNE");
});

test("renvoie des positions exactes (le titre n'est pas capturé)", () => {
  const text = "Voir Mme Martin svp";
  const [m] = detectPersons(text);
  assert.equal(text.slice(m.start, m.end), "Martin");
});

test("gère plusieurs civilités", () => {
  const matches = detectPersons("Dr Roy et Pr Lévêque");
  assert.deepEqual(
    matches.map((m) => m.value),
    ["Roy", "Lévêque"],
  );
});

// Cas « ne doit PAS détecter » : sans déclencheur de civilité, on s'abstient
// (le détecteur est volontairement conservateur).
test("ne détecte pas un nom sans civilité", () => {
  assert.equal(detectPersons("Dupont est venu").length, 0);
  assert.equal(detectPersons("avec camille en minuscule").length, 0);
});

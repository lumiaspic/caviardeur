// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import { detectEmails } from "../src/detect/email.js";

test("détecte une adresse e-mail simple", () => {
  const matches = detectEmails("Écrivez à jean.dupont@example.com merci.");
  assert.equal(matches.length, 1);
  assert.equal(matches[0].value, "jean.dupont@example.com");
  assert.equal(matches[0].type, "EMAIL");
});

test("détecte plusieurs adresses", () => {
  const matches = detectEmails("a@b.fr et c.d@e-f.co.uk");
  assert.deepEqual(
    matches.map((m) => m.value),
    ["a@b.fr", "c.d@e-f.co.uk"],
  );
});

test("renvoie des positions exactes", () => {
  const text = "x contact@site.org y";
  const [m] = detectEmails(text);
  assert.equal(text.slice(m.start, m.end), "contact@site.org");
});

// Cas « ne doit PAS détecter » : aussi important que les détections.
test("ne détecte pas une chaîne sans domaine valide", () => {
  assert.equal(detectEmails("ceci @ n'est pas un email").length, 0);
  assert.equal(detectEmails("arobase a@b sans tld").length, 0);
});

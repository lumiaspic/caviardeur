// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import { runDetectors, detectors } from "../src/detect/index.js";

test("runDetectors appose la fiabilité de chaque détecteur", () => {
  const matches = runDetectors("Écrire à a@b.fr, reçu par M. Dupont.");
  const email = matches.find((m) => m.type === "EMAIL");
  const person = matches.find((m) => m.type === "PERSONNE");
  assert.equal(email?.reliability, "reliable");
  assert.equal(person?.reliability, "ambiguous");
});

test("toute occurrence sortie de runDetectors porte une fiabilité", () => {
  const matches = runDetectors("a@b.fr et M. Roy");
  assert.ok(matches.length > 0);
  for (const m of matches) {
    assert.ok(
      ["reliable", "noisy", "ambiguous"].includes(m.reliability ?? ""),
      `fiabilité manquante pour ${m.type}`,
    );
  }
});

test("le registre déclare une fiabilité valide pour chaque entrée", () => {
  for (const entry of detectors) {
    assert.equal(typeof entry.detect, "function");
    assert.ok(["reliable", "noisy", "ambiguous"].includes(entry.reliability));
  }
});

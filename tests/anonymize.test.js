// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";
import { anonymize } from "../src/anonymize.js";

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

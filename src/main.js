// @ts-check

import { runDetectors } from "./detect/index.js";
import { anonymize, matchKey } from "./anonymize.js";

/**
 * @typedef {import("./detect/types.js").Match} Match
 */

/**
 * Récupère un élément par id ou lève une erreur (garde-fou de typage).
 * @template {Element} T
 * @param {string} id
 * @returns {T}
 */
function el(id) {
  const node = document.getElementById(id);
  if (!node) throw new Error(`Élément introuvable : #${id}`);
  return /** @type {T} */ (/** @type {unknown} */ (node));
}

/** @type {HTMLTextAreaElement} */
const input = el("input");
/** @type {HTMLTextAreaElement} */
const output = el("output");
/** @type {HTMLElement} */
const result = el("result");
/** @type {HTMLElement} */
const bracketWarning = el("bracket-warning");
/** @type {HTMLElement} */
const suggestionsSection = el("suggestions-section");
/** @type {HTMLElement} */
const suggestionsList = el("suggestions");
/** @type {HTMLElement} */
const tableBody = el("table").querySelector("tbody") ?? document.createElement("tbody");

// État de la session courante. Rien n'est persisté (règle n°5).
/** @type {string} */
let currentText = "";
/** @type {Match[]} */
let currentMatches = [];
/** Clés (`matchKey`) des suggestions validées par l'utilisateur. @type {Set<string>} */
const accepted = new Set();

/**
 * (Re)calcule l'anonymisation à partir de l'état courant et rafraîchit l'UI.
 * Appelée au clic « Caviarder » et à chaque validation de suggestion.
 */
function render() {
  const { text, table, suggestions, bracketCollision } = anonymize(
    currentText,
    currentMatches,
    accepted,
  );

  output.value = text;
  bracketWarning.hidden = !bracketCollision;

  tableBody.replaceChildren(
    ...table.map((entry) => {
      const tr = document.createElement("tr");
      for (const cell of [entry.token, entry.type, entry.value]) {
        const td = document.createElement("td");
        td.textContent = cell;
        tr.appendChild(td);
      }
      return tr;
    }),
  );

  suggestionsSection.hidden = suggestions.length === 0;
  suggestionsList.replaceChildren(
    ...suggestions.map((m) => {
      const key = matchKey(m);
      const li = document.createElement("li");
      const label = document.createElement("label");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = accepted.has(key);
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) accepted.add(key);
        else accepted.delete(key);
        render();
      });

      const span = document.createElement("span");
      span.textContent = `${m.value} — ${m.type}`;

      label.append(checkbox, span);
      li.appendChild(label);
      return li;
    }),
  );

  result.hidden = false;
}

el("run").addEventListener("click", () => {
  currentText = input.value;
  currentMatches = runDetectors(currentText);
  // Nouvelle analyse : on repart de zéro côté suggestions validées.
  accepted.clear();
  render();
});

el("copy").addEventListener("click", async () => {
  await navigator.clipboard.writeText(output.value);
});

// Indicateur hors-ligne : rappelle que l'outil fonctionne sans réseau.
// Vérifiez vous-même : coupez votre connexion, tout continue de marcher.
const status = el("network-status");
function refreshNetworkStatus() {
  status.textContent = navigator.onLine
    ? "🌐 En ligne — mais votre texte ne part nulle part. Coupez le réseau pour vérifier."
    : "✅ Hors ligne — et l'outil fonctionne toujours. C'est la preuve.";
}
addEventListener("online", refreshNetworkStatus);
addEventListener("offline", refreshNetworkStatus);
refreshNetworkStatus();

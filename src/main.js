// @ts-check

import { runDetectors } from "./detect/index.js";
import { anonymize } from "./anonymize.js";

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
const tableBody = el("table").querySelector("tbody") ?? document.createElement("tbody");

el("run").addEventListener("click", () => {
  const text = input.value;
  const matches = runDetectors(text);
  const { text: anonymized, table } = anonymize(text, matches);

  output.value = anonymized;
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
  result.hidden = false;
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

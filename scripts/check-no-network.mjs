// @ts-check
// Garde-fou « zéro réseau » (règle n°1 de CLAUDE.md).
//
// Scanne le code livré au navigateur (src/** et index.html) à la recherche de
// motifs qui feraient SORTIR le texte de l'utilisateur de la page : appels
// réseau, ressources tierces, polices/CSS distants.
//
// ⚠ Heuristique, pas une preuve. La preuve reste le test hors-ligne (couper le
// réseau et utiliser l'outil — voir README/SECURITY). Ce script attrape les
// régressions évidentes et documente, exécutable, l'intention du projet.
//
// Zéro dépendance (Node natif). Sort en code ≠ 0 si un motif interdit est trouvé.

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

/** Fichiers et dossiers (relatifs à la racine) effectivement servis au navigateur. */
const TARGETS = ['src', 'index.html'];

/** Extensions analysées. */
const EXTENSIONS = ['.js', '.mjs', '.css', '.html'];

/**
 * @typedef {{ label: string, re: RegExp }} Rule
 */

/** @type {Rule[]} */
const RULES = [
  { label: 'appel fetch()', re: /\bfetch\s*\(/ },
  { label: 'XMLHttpRequest', re: /\bXMLHttpRequest\b/ },
  { label: 'WebSocket', re: /\bWebSocket\b/ },
  { label: 'EventSource (SSE)', re: /\bEventSource\b/ },
  { label: 'navigator.sendBeacon', re: /\.sendBeacon\s*\(/ },
  { label: 'import depuis une URL', re: /\bfrom\s+['"]https?:\/\//i },
  { label: 'import() dynamique depuis une URL', re: /\bimport\s*\(\s*['"]https?:\/\//i },
  { label: 'script externe (CDN)', re: /<script[^>]+src\s*=\s*['"]?https?:\/\//i },
  { label: 'lien externe (CSS/police CDN)', re: /<link[^>]+href\s*=\s*['"]?https?:\/\//i },
  { label: '@import CSS distant', re: /@import\s+(url\(\s*)?['"]?https?:\/\//i },
  { label: 'url() distante (police/image CDN)', re: /\burl\(\s*['"]?https?:\/\//i },
];

/** @returns {string[]} liste des fichiers à analyser, en chemins absolus. */
function collectFiles() {
  /** @type {string[]} */
  const files = [];
  /** @param {string} abs */
  function walk(abs) {
    const st = statSync(abs);
    if (st.isDirectory()) {
      for (const entry of readdirSync(abs)) walk(join(abs, entry));
    } else if (EXTENSIONS.some((ext) => abs.endsWith(ext))) {
      files.push(abs);
    }
  }
  for (const target of TARGETS) {
    const abs = join(root, target);
    try {
      walk(abs);
    } catch {
      // Cible absente (ex. index.html pas encore créé) : on ignore.
    }
  }
  return files;
}

/** @type {{ file: string, line: number, label: string, text: string }[]} */
const findings = [];

for (const abs of collectFiles()) {
  const lines = readFileSync(abs, 'utf8').split(/\r?\n/);
  lines.forEach((text, i) => {
    for (const rule of RULES) {
      if (rule.re.test(text)) {
        findings.push({
          file: relative(root, abs).replace(/\\/g, '/'),
          line: i + 1,
          label: rule.label,
          text: text.trim(),
        });
      }
    }
  });
}

if (findings.length > 0) {
  console.error('✖ Garde-fou « zéro réseau » : motif(s) interdit(s) détecté(s).\n');
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line} — ${f.label}`);
    console.error(`    ${f.text}\n`);
  }
  console.error(
    'Le code servi au navigateur ne doit déclencher AUCUN accès réseau\n' +
      '(règle n°1 de CLAUDE.md). Si ce signalement est un faux positif légitime,\n' +
      'discutez-en dans la PR avant d’assouplir la règle.',
  );
  process.exit(1);
}

console.log('✔ Garde-fou « zéro réseau » : aucun motif réseau dans le code servi.');

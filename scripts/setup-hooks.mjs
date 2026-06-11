// @ts-check
// Active les hooks git natifs du dépôt en pointant core.hooksPath vers .githooks/.
// Branché sur le script npm « prepare » : s'exécute après `npm install`,
// sans husky ni dépendance. Échoue silencieusement hors d'un dépôt git
// (ex. installation depuis un tarball) pour ne jamais casser l'install.

import { execFileSync } from 'node:child_process';

try {
  execFileSync('git', ['rev-parse', '--is-inside-work-tree'], { stdio: 'ignore' });
} catch {
  // Pas un dépôt git : rien à configurer.
  process.exit(0);
}

try {
  execFileSync('git', ['config', 'core.hooksPath', '.githooks'], { stdio: 'ignore' });
  console.log('✔ Hooks git activés (core.hooksPath = .githooks).');
} catch {
  // Ne jamais faire échouer l'installation à cause des hooks.
  console.warn('⚠ Impossible d’activer les hooks git automatiquement.');
}

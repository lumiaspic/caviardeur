# Journal des changements

Toutes les évolutions notables de ce projet sont consignées ici.

Le format suit [Keep a Changelog 1.1.0](https://keepachangelog.com/fr/1.1.0/) et
le projet adhère au [versionnement sémantique](https://semver.org/lang/fr/).
La politique de versionnement et la procédure de release sont décrites dans
[`docs/releasing.md`](docs/releasing.md).

## [Non publié]

### Ajouté

- Convention de commits (Conventional Commits) vérifiée par un hook git natif
  (`.githooks/commit-msg`), activé automatiquement via `npm install`.
- Garde-fou « zéro réseau » (`scripts/check-no-network.mjs`) appliqué en hook
  pre-commit et en intégration continue.
- Intégration continue GitHub Actions : tests, vérification des types et garde-fou
  réseau sur une matrice de versions de Node ; validation des messages de commit
  des *pull requests*.
- Gouvernance : code de conduite (Contributor Covenant), gabarits de *pull
  request* et d'issues (bug, évolution) avec menu de configuration, `CODEOWNERS`,
  configuration Dependabot (actions GitHub et npm).
- Politique de versionnement et procédure de release (`docs/releasing.md`).
- `typescript` et `@types/node` épinglés en dépendances de développement +
  `package-lock.json` pour un `typecheck` reproductible.
- `.editorconfig` pour une mise en forme cohérente entre éditeurs.

[Non publié]: https://github.com/lumiaspic/caviardeur/commits/main

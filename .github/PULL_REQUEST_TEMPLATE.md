<!--
Merci pour cette contribution ! Décrivez votre changement et cochez la checklist.
Une PR = un changement atomique. Voir CONTRIBUTING.md.
-->

## Résumé

<!-- Que fait ce changement, et pourquoi ? -->

## Type de changement

- [ ] `fix` — correction de bug (dont faux négatif de détection)
- [ ] `feat` — nouvelle fonctionnalité / nouveau détecteur
- [ ] `docs` — documentation seule
- [ ] `refactor` / `perf` / `test` / `build` / `ci` / `chore`

## Checklist

- [ ] Je respecte les **contraintes non négociables** du projet (zéro réseau,
      zéro build, aucun ML, honnêteté) — voir [`CLAUDE.md`](../CLAUDE.md).
- [ ] `npm test` passe (cas « doit détecter » **et** « ne doit pas détecter »).
- [ ] `npm run typecheck` passe.
- [ ] `npm run check:network` passe (aucun accès réseau introduit).
- [ ] Mes commits suivent les **Conventional Commits**.
- [ ] J'ai mis à jour [`CHANGELOG.md`](../CHANGELOG.md) (section « Non publié »)
      si le changement est visible pour l'utilisateur.
- [ ] Si je corrige un **faux négatif**, j'ai ajouté un **test de régression**.

## Note

> Je n'ai inclus **aucune vraie donnée personnelle** dans cette PR ni dans les
> tests (exemples fictifs uniquement).

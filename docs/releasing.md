# Versionnement et publication de releases

## Versionnement sémantique

caviardeur suit le [versionnement sémantique](https://semver.org/lang/fr/) :
`MAJEUR.MINEUR.CORRECTIF` (ex. `1.4.2`).

- **MAJEUR** : changement incompatible (comportement de caviardage modifié d'une
  façon qui peut surprendre l'utilisateur, format de sortie cassé, suppression
  d'une catégorie de détection…).
- **MINEUR** : ajout rétrocompatible (nouveau détecteur, nouvelle option).
- **CORRECTIF** : correction rétrocompatible (faux négatif corrigé, bug d'UI…).

> **Phase `0.x`.** Tant que le projet n'a pas atteint `1.0.0`, tout peut encore
> bouger : un incrément **mineur** peut introduire un changement cassant. Le
> passage à `1.0.0` signalera que l'outil est considéré comme stable pour un
> usage quotidien.

Un **faux négatif** corrigé est au minimum un `CORRECTIF` ; s'il a fallu changer
le comportement de détection de façon visible, c'est un `MINEUR` (ou `MAJEUR`).

## Convention de tags

Chaque release est un **tag git annoté** préfixé par `v` : `v0.2.0`, `v1.0.0`.
Pas de tags « flottants », pas de tag qu'on déplace. Un tag = un état figé et
auditable du dépôt.

## Procédure de release

1. **Mettre à jour le CHANGELOG.** Renommer la section `## [Non publié]` en
   `## [X.Y.Z] - AAAA-MM-JJ`, puis recréer une section `## [Non publié]` vide
   au-dessus. Vérifier que chaque entrée est classée (Ajouté / Modifié / Corrigé
   / Supprimé / Déprécié / Sécurité).
2. **Bumper la version** dans `package.json` (`version`), avec un commit dédié :
   `chore(release): vX.Y.Z`.
3. **Vérifier** que tout est vert : `npm test`, `npm run typecheck`,
   `npm run check:network`.
4. **Taguer** : `git tag -a vX.Y.Z -m "vX.Y.Z"` puis `git push origin vX.Y.Z`.
5. **Publier la release GitHub** à partir du tag, en reprenant la section
   correspondante du CHANGELOG comme notes de version.

Comme l'outil est servi en statique sans build, il n'y a **aucun artefact à
compiler ou à publier** : la release est l'état du dépôt au tag. C'est tout
l'intérêt du principe « le source = l'artefact ».

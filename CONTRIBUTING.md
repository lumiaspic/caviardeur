# Contribuer à caviardeur

Merci de l'intérêt porté à ce commun numérique. Quelques principes avant tout :
caviardeur a des **contraintes non négociables** (voir [`CLAUDE.md`](CLAUDE.md)).
Une contribution qui les enfreint ne pourra pas être fusionnée, même si elle est
techniquement bonne.

## Les contraintes à respecter

- **Zéro réseau au runtime** : le texte de l'utilisateur ne sort jamais du
  navigateur. Aucun appel distant, tracker, CDN, police externe.
- **Zéro build** : modules ES natifs, pas de bundler/minifier/transpileur. Le code
  servi = le code du dépôt.
- **Aucun ML** : détection par règles et dictionnaires uniquement.
- **Honnêteté** : on ne surpromet jamais l'anonymisation.

## Signaler un faux négatif (priorité absolue)

Si l'outil a **raté** une donnée sensible, c'est le bug le plus important.
Ouvrez une issue avec un **exemple anonymisé** (ne collez pas de vraies données
personnelles dans l'issue !) montrant ce qui aurait dû être détecté. Chaque faux
négatif confirmé devient un test de régression.

## Mise en route

```sh
npm install   # installe l'outillage de dev ET active les hooks git du dépôt
```

Le dépôt n'a **aucune dépendance runtime** ; `npm install` ne récupère que de
l'outillage de développement (TypeScript pour la vérification de types). Il active
aussi automatiquement les hooks git (`.githooks/`) qui valident vos commits.

Scripts disponibles :

| Commande                | Rôle                                                       |
| ----------------------- | ---------------------------------------------------------- |
| `npm test`              | Tests (runner natif de Node, zéro dépendance).             |
| `npm run typecheck`     | Vérification des types (JSDoc + `tsc --noEmit`).           |
| `npm run check:network` | Garde-fou « zéro réseau » sur le code servi.               |

## Flux de contribution

1. Une **branche par changement**, une **PR** par changement. Nommage :
   `feat/…`, `fix/…`, `docs/…`, `refactor/…`, `chore/…`, `ci/…`.
2. Ajoutez/mettez à jour les **tests** : cas « doit détecter » **et** « ne doit
   pas détecter ».
3. Tout doit passer en local : `npm test`, `npm run typecheck`,
   `npm run check:network` (la CI les rejoue de toute façon).
4. Mettez à jour [`CHANGELOG.md`](CHANGELOG.md) (section « Non publié ») si le
   changement est visible pour l'utilisateur.
5. Commits **petits, atomiques et conventionnels** (voir ci-dessous).

## Convention de commits

On suit les [Conventional Commits](https://www.conventionalcommits.org/fr/) :
le format est `type(scope optionnel): sujet`. Le hook `commit-msg` le vérifie à
chaque commit ; la CI le revérifie sur chaque commit de la PR.

```
feat: ajoute le détecteur IBAN
fix(email): gère les sous-domaines
docs: clarifie la promesse hors-ligne
refactor!: renomme l'API des détecteurs   # le « ! » = changement cassant
```

Types : `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`,
`ci`, `chore`, `revert`. Voir [`docs/releasing.md`](docs/releasing.md) pour le lien
entre types de commits, versionnement et releases.

Merci aussi de respecter notre [code de conduite](CODE_OF_CONDUCT.md).

## Note sur l'IA

Ce projet est développé avec l'assistance de Claude Code, de façon assumée. Les
contributions assistées par IA sont les bienvenues, à condition d'être **relues,
comprises et testées** par un humain avant proposition. La responsabilité du code
proposé est celle du contributeur, pas de l'outil.

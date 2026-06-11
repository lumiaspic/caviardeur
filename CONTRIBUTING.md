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

## Flux de contribution

1. Une **branche par changement**, une **PR** par changement.
2. Ajoutez/mettez à jour les **tests** : cas « doit détecter » et « ne doit pas
   détecter ».
3. `npm test` doit passer. Vérifiez les types : `npx tsc --noEmit` (si TypeScript
   est installé localement).
4. Commits petits et explicites.

## Note sur l'IA

Ce projet est développé avec l'assistance de Claude Code, de façon assumée. Les
contributions assistées par IA sont les bienvenues, à condition d'être **relues,
comprises et testées** par un humain avant proposition. La responsabilité du code
proposé est celle du contributeur, pas de l'outil.

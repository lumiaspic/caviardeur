---
name: Évolution / nouveau détecteur
about: Proposer une fonctionnalité ou une nouvelle catégorie de détection.
labels: enhancement
---

## Besoin

<!-- Quel problème concret cette évolution résout-elle ? Pour qui ? -->

## Proposition

<!-- Ce que vous imaginez. Pour un détecteur : quelle catégorie, quels formats ? -->

## Compatibilité avec les contraintes du projet

caviardeur a des contraintes **non négociables** (voir [`CLAUDE.md`](../../CLAUDE.md)).
Merci de confirmer que la proposition les respecte :

- [ ] **Zéro réseau** : aucune ressource ni appel distant.
- [ ] **Zéro build / aucun ML** : faisable en modules ES natifs, par règles ou
      dictionnaires open data statiques.
- [ ] **Honnêteté** : ne laisse pas croire à une anonymisation parfaite.

## Fiabilité attendue

- [ ] Détection **fiable** (appliquée d'office, ex. e-mail, IBAN).
- [ ] Détection **ambiguë** (suggestion à valider par l'utilisateur, ex. prénom,
      ville).

# caviardeur

[![CI](https://github.com/lumiaspic/caviardeur/actions/workflows/ci.yml/badge.svg)](https://github.com/lumiaspic/caviardeur/actions/workflows/ci.yml)
[![Licence: GPL v3](https://img.shields.io/badge/licence-GPLv3-blue.svg)](LICENSE)

**Collez un texte, récupérez-en une version anonymisée — sans que rien ne quitte votre navigateur.**

`caviardeur` est un outil qui détecte et remplace les informations identifiantes
(noms, adresses, e-mails, IBAN, montants, sociétés…) d'un texte que vous comptez
coller dans un assistant IA (ChatGPT, Claude, Le Chat…). Il vous rend une version
caviardée, avec une table de correspondance pour vous y retrouver.

## La promesse

- **100 % local.** Le texte que vous collez ne quitte jamais votre machine. Aucun
  serveur, aucun envoi réseau, aucun tracker, aucune dépendance tierce chargée à
  distance. **Coupez votre connexion après le chargement de la page : l'outil
  fonctionne toujours.** C'est la preuve la plus simple de la promesse.
- **Auditable.** Le code servi au navigateur est exactement celui de ce dépôt :
  pas de build, pas de minification, pas de transpilation. Ce que vous lisez ici
  est ce qui s'exécute chez vous.
- **Increvable.** Détection par règles et dictionnaires open data — aucun modèle
  d'apprentissage automatique à entraîner ni à maintenir. Conçu pour rester
  fonctionnel des années sans entretien.

## Ce que l'outil n'est pas (honnêteté assumée)

caviardeur **vous aide à repérer et masquer** des données sensibles ; il ne
garantit pas une anonymisation parfaite et automatique. Il **rate forcément des
choses** (un prénom rare, une tournure inhabituelle). C'est pourquoi il vous
montre ce qu'il a détecté et vous laisse corriger : **la vérification finale vous
revient.** Ne considérez jamais qu'un texte caviardé peut être partagé sans
relecture.

Par ailleurs, masquer un nom ne rend pas anodin le partage d'un contenu
confidentiel : le *contenu* d'un dossier reste sensible même sans le nom. Voir
[`docs/threat-model.md`](docs/threat-model.md).

## État du projet

Projet naissant, en cours de construction. Voir les *issues* pour la feuille de
route.

## Contribuer

Les contributions sont les bienvenues — surtout les **faux négatifs** (données
ratées par l'outil), qui sont notre priorité. Avant de vous lancer :

- [`CONTRIBUTING.md`](CONTRIBUTING.md) — mise en route, conventions de commits et
  flux de travail.
- [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md) — règles de savoir-vivre.
- [`SECURITY.md`](SECURITY.md) — signaler une fuite de données ou une faille.
- [`CHANGELOG.md`](CHANGELOG.md) — historique des versions.

## Licence

[GPLv3](LICENSE). caviardeur est un commun numérique : libre, et qui le reste.

---

*Développé avec l'assistance de [Claude Code](https://claude.com/claude-code).
Ce choix est assumé et fait partie de la démarche d'auditabilité : tout le code
est relu, testé et lisible — venez vérifier.*

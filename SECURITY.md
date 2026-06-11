# Politique de sécurité

caviardeur est un outil de confidentialité : sa sécurité **est** sa raison d'être.
Deux catégories de problèmes nous intéressent particulièrement.

## 1. Fuite de données (le plus grave)

Tout ce qui pourrait faire **sortir le texte de l'utilisateur du navigateur** :
appel réseau inattendu, ressource tierce, télémétrie, dépendance qui exfiltre.
C'est une faille critique. Signalez-la en priorité (voir ci-dessous).

## 2. Faux négatif de détection

Une donnée sensible **non détectée** trahit la promesse de l'outil. Ce n'est pas
une « faille » classique, mais on la traite avec le même sérieux. Voir
[`CONTRIBUTING.md`](CONTRIBUTING.md) pour signaler un faux négatif (avec un exemple
**anonymisé**, jamais de vraies données).

## Comment signaler

- Pour une **faille de confidentialité/sécurité** : ouvrez un *security advisory*
  privé sur GitHub, ou contactez le mainteneur avant toute divulgation publique.
- **Ne joignez jamais de vraies données personnelles** à un rapport. Reproduisez
  le problème avec des données fictives.

## Vérifier la promesse vous-même

Vous n'avez pas à nous croire sur parole :

- Ouvrez la page, **coupez votre connexion réseau**, utilisez l'outil : il doit
  fonctionner entièrement hors ligne.
- Inspectez l'onglet « Réseau » des outils de développement : aucune requête ne
  doit partir pendant le caviardage.
- Le code servi est celui de ce dépôt (pas de build) : vous pouvez le lire.

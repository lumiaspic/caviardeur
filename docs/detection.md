# Catégories de détection

caviardeur détecte par **règles** (expressions régulières, clés de contrôle) et
**dictionnaires** (listes open data, statiques et versionnées). Aucun modèle
d'apprentissage. Chaque catégorie a un niveau de fiabilité qui détermine si elle
est **appliquée d'office** ou **proposée en suggestion à valider**.

## Niveaux de fiabilité

- ✅ **Fiable** — appliqué d'office. Peu ou pas de faux positifs.
- 🟡 **Bon mais sur-détecte** — appliqué, mais facilement désactivable / corrigible.
- 🟠 **Ambigu** — proposé en **suggestion**, jamais imposé. L'utilisateur valide.

## Catégories

| Catégorie            | Méthode                              | Fiabilité | Statut V1 |
|----------------------|--------------------------------------|-----------|-----------|
| E-mail               | regex                                | ✅        | implémenté |
| Téléphone (FR + int.)| regex                                | ✅        | à faire   |
| IBAN / RIB           | regex + clé de contrôle (mod 97)     | ✅        | à faire   |
| Carte bancaire       | regex + Luhn                         | ✅        | à faire   |
| N° de sécu (NIR)     | regex + clé de contrôle              | ✅        | à faire   |
| SIREN / SIRET        | regex + Luhn                         | ✅        | à faire   |
| Adresse IP, URL      | regex                                | ✅        | à faire   |
| Montants (€, k€…)    | regex                                | 🟡        | à faire   |
| Code postal          | regex + liste                        | 🟡        | à faire   |
| Adresse postale      | regex + mots-clés (rue, av., bd…)    | 🟡        | à faire   |
| Date                 | regex                                | 🟡        | à faire   |
| Prénom / Nom         | dictionnaire INSEE + désambiguïsation| 🟠        | à faire   |
| Ville / lieu         | dictionnaire communes + contexte     | 🟠        | à faire   |
| Société              | dictionnaire + heuristiques          | 🟠        | à faire   |

## Le défi central : la désambiguïsation

Les dictionnaires de prénoms, noms et communes provoquent des **faux positifs
massifs** par ambiguïté : « Rose », « Pierre », « Florence », « Camille » sont à la
fois prénoms, mots communs et/ou villes. Le cœur algorithmique du projet consiste
à **désambiguïser par le contexte** sans modèle ML :

- majuscule en milieu de phrase (vs début de phrase),
- mot déclencheur précédent (« M. », « Mme », « à », « chez », « habite »…),
- position et ponctuation,
- présence simultanée prénom + nom voisins.

Quand la confiance est insuffisante, on **propose** sans appliquer. Mieux vaut une
suggestion qu'un faux positif imposé — et toujours mieux qu'un faux négatif
silencieux.

## Jetons de remplacement

Remplacement par **jetons explicites cohérents** : `[CATÉGORIE_n]`. La même entité
reçoit toujours le même jeton dans tout le texte (« Jean », puis « M. Dupont »
désignant la même personne → même jeton si rapprochés). Granularité par défaut :
regrouper une personne sous un seul jeton `[PERSONNE_n]` plutôt que
`[PRÉNOM_n] [NOM_n]` (à confirmer à l'implémentation). Gérer le cas où le texte
original contient déjà des crochets (collision de délimiteurs).

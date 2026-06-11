# Données (dictionnaires)

Ce dossier contient les **dictionnaires** (gazetteers) utilisés par la détection :
prénoms, noms de famille, communes, etc. Ils proviennent de données ouvertes
(principalement INSEE) et sont **statiques** — c'est ce qui rend l'outil
increvable.

## Principe : le source = l'artefact, jusque dans les données

- Les **données préparées** (prêtes à être chargées par le navigateur) sont
  **versionnées ici** et lisibles. Ce que charge l'outil est ce que vous voyez
  dans le dépôt.
- La **transformation** des fichiers bruts INSEE vers ces données préparées se
  fait par un **script one-shot** (lancé à la main lors d'une mise à jour
  INSEE), pas par un build dans le chemin de service. Sa sortie est commitée.
- Les fichiers **bruts** téléchargés (avant transformation) ne sont pas versionnés
  (voir `.gitignore`, dossier `data/raw/`).

## À documenter à l'arrivée des dictionnaires

- Sources exactes et licences des jeux de données INSEE.
- Format des fichiers préparés et structure de recherche choisie.
- Procédure de mise à jour (script, fréquence).

> Aucun dictionnaire n'est encore intégré. Voir les issues.

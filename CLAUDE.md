# caviardeur — règles du projet

Outil web qui anonymise (« caviarde ») un texte collé, pour le partager à un
assistant IA sans divulguer d'informations identifiantes. **100 % local, statique,
increvable, auditable.** Lis ce fichier avant toute session de développement.

## Règles non négociables

Ces contraintes définissent l'identité du projet. Ne les enfreins jamais sans que
l'utilisateur ne les ait explicitement levées.

1. **Zéro réseau au runtime.** Le texte de l'utilisateur ne doit JAMAIS sortir du
   navigateur. Aucun `fetch`/`XHR`/WebSocket vers un serveur distant, aucune
   télémétrie, aucun tracker, aucune police ou ressource chargée depuis un CDN.
   Tout est servi depuis le même origine, en statique.
2. **Zéro build entre le source et le navigateur.** Pas de bundler, pas de
   minification, pas de transpilation. Le JS/CSS servi est identique au source du
   dépôt (principe « le source = l'artefact »). On code en **modules ES natifs**.
3. **Types via JSDoc + `// @ts-check`**, pas de TypeScript émis. La vérification
   de types se fait sans transformer le code (`tsc --noEmit`).
4. **Aucun modèle d'apprentissage automatique.** Détection par **règles (regex,
   clés de contrôle) et dictionnaires** (gazetteers open data, statiques,
   versionnés). C'est ce qui rend l'outil increvable.
5. **Pas de comptes, pas de stockage persistant, pas d'historique.** Rien à
   stocker = rien à fuiter. (localStorage toléré uniquement pour des préférences
   non sensibles, jamais pour le texte de l'utilisateur.)
6. **Honnêteté avant tout.** L'UI ne doit jamais laisser croire à une
   anonymisation parfaite. On affiche ce qui est détecté, on invite à relire, on
   assume les limites. Un faux négatif (donnée non détectée) est le pire échec :
   le design doit en tenir compte.

## Conventions de code

- Modules ES (`import`/`export`), un module = une responsabilité.
- Chaque module JS commence par `// @ts-check`. Types documentés en JSDoc.
- Français pour l'UI, les commentaires et la documentation. Identifiants de code
  en anglais (convention).
- Pas de dépendance runtime. L'outillage de dev (tests, lint, typecheck) est
  autorisé tant qu'il ne touche pas à l'artefact livré.

## Architecture de la détection

- Un **détecteur** est une fonction `(texte) => Match[]`, où
  `Match = { start, end, value, type }`. Voir `src/detect/`.
- Les détecteurs structurés fiables (e-mail, IBAN, etc.) sont actifs et appliqués.
- Les détecteurs ambigus (prénom, ville, société) sont des **suggestions à
  valider** par l'utilisateur, jamais imposées silencieusement.
- Le moteur d'anonymisation assigne des **jetons explicites cohérents** :
  même entité → même jeton (`[EMAIL_1]`, `[PERSONNE_1]`, `[VILLE_1]`…), partout.
- Voir `docs/detection.md` pour la liste des catégories et leur fiabilité.

## Tests

Le **corpus de tests est le pilier** de la maintenabilité et de l'audit. Chaque
détecteur a des cas « doit détecter » ET « ne doit PAS détecter » (faux positifs).
Tout faux négatif signalé devient un test de régression. Lance `npm test`
(runner natif de Node, zéro dépendance).

## Workflow

- Une **branche + une PR par changement**, même en solo : ça crée la trace
  auditable. Commits petits et atomiques.
- Avant de fusionner : `npm test`, puis penser à `/code-review` et surtout
  `/security-review` vu la nature de l'outil.
- Commits co-signés Claude (transparence assumée).

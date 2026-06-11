# Modèle de menace

« Anonymiser » n'a de sens que face à un adversaire donné. Ce document explicite
contre quoi caviardeur protège, et contre quoi il **ne** protège **pas**. Il est
volontairement honnête : un outil de confidentialité qui surpromet est dangereux,
car il rend ses utilisateurs imprudents.

## Contre quoi caviardeur protège (objectif principal)

**Empêcher le fournisseur d'un assistant IA d'apprendre les informations
identifiantes contenues dans votre texte.** Vous voulez utiliser un LLM sur un
contenu réel, mais sans lui livrer noms, e-mails, IBAN, adresses, etc. caviardeur
remplace ces éléments par des jetons avant que vous ne colliez le texte. Le
fournisseur voit `[PERSONNE_1]` et `[VILLE_1]`, pas Jean Dupont à Quimper.

C'est le scénario où l'outil est franchement utile et efficace.

## Contre quoi caviardeur NE protège PAS

- **Le contenu reste sensible.** Masquer les identités ne masque pas le *sujet* :
  un contrat, un dossier médical, une stratégie d'entreprise restent
  confidentiels même sans les noms. Ne partagez pas un contenu confidentiel en
  croyant qu'il est devenu anodin.
- **Réidentification par recoupement.** Un texte caviardé peut rester
  identifiable par déduction (« le maire de cette commune de 800 habitants… »).
  L'outil ne supprime pas ce risque.
- **Ce n'est pas une anonymisation au sens du RGPD.** Le remplacement est
  réversible (table de correspondance) : il s'agit d'une **pseudonymisation**, qui
  **reste une donnée personnelle** au sens juridique. caviardeur réduit votre
  exposition, il ne vous exonère pas de vos obligations.
- **Faux négatifs.** La détection par règles et dictionnaires **rate des choses**
  (prénom rare ou étranger, tournure inhabituelle, faute de frappe). C'est pour ça
  que l'UI montre ce qui est détecté et exige une relecture humaine.

## Hypothèses de confiance

- L'utilisateur fait tourner l'outil dans un navigateur sain, sur une machine
  saine. caviardeur ne protège pas contre un appareil déjà compromis.
- L'hébergement sert bien le code de ce dépôt, sans altération (HTTPS,
  idéalement intégrité vérifiable). L'architecture sans build rend cette
  vérification possible.

## Conséquence sur le design

- La détection ambiguë (noms, lieux, sociétés) est **proposée, jamais imposée
  silencieusement** : l'humain valide.
- L'UI répète l'invitation à relire et n'affiche jamais un « anonymisé ✓ »
  triomphal qui donnerait une fausse assurance.

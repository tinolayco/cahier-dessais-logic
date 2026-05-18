# Guide de Planification

Une application de cahier d'essais logiciels qui permet aux équipes d'assurance qualité de documenter les procédures de test avec support multimédia enrichi, suivre les critères de réussite/échec via des cases à cocher, et exporter/importer les données de test en format JSON.

**Qualités d'Expérience**:
1. **Efficace** - Saisie rapide avec raccourcis clavier et collage d'images en ligne pour une documentation de test rapide
2. **Visuel** - Support de texte enrichi avec icônes et captures d'écran intégrées pour créer des procédures de test claires et illustratives
3. **Fiable** - Persistance automatique et export/import JSON pour prévenir la perte de données et permettre le partage

**Niveau de Complexité**: Application Légère (multiples fonctionnalités avec état basique)
- Ceci est un outil de documentation de test ciblé avec plusieurs fonctionnalités interconnectées (articles de test, exigences, critères, gestion des médias) mais reste une application à vue unique avec des opérations CRUD simples et E/S de fichiers.

## Fonctionnalités Essentielles

### Gestion des Articles de Test
- **Fonctionnalité**: Créer, éditer et supprimer des articles de test (end items) qui représentent les composants ou fonctionnalités logicielles testées
- **But**: Organiser les tests par les éléments logiciels spécifiques en évaluation
- **Déclencheur**: Cliquer sur le bouton "Ajouter un Article de Test" ou utiliser le raccourci clavier
- **Progression**: Clic sur ajouter → Saisir le nom de l'article → L'article apparaît dans la liste → Peut être sélectionné pour voir/éditer les exigences
- **Critères de succès**: Les utilisateurs peuvent créer plusieurs articles de test, basculer entre eux, et chacun maintient son propre ensemble d'exigences

### Saisie d'Exigences avec Médias Enrichis
- **Fonctionnalité**: Ajouter des exigences de test avec images intégrées (icônes, captures d'écran) et texte formaté décrivant les étapes de test
- **But**: Créer des procédures de test claires et visuelles faciles à suivre
- **Déclencheur**: Cliquer sur "Ajouter Exigence" dans un article de test
- **Progression**: Clic sur ajouter → Saisir le texte de l'exigence → Coller ou télécharger des images en ligne → Les images apparaissent intégrées dans le texte → Exigence sauvegardée
- **Critères de succès**: Les utilisateurs peuvent coller des captures d'écran directement, télécharger de petites icônes, et voir les images rendues en ligne avec le texte; les images sont préservées dans l'export JSON

### Suivi des Critères de Réussite/Échec
- **Fonctionnalité**: Définir plusieurs critères de réussite/échec sous forme de cases à cocher pour chaque exigence
- **But**: Suivre quels points de validation ont été complétés pendant les tests
- **Déclencheur**: Ajouter des critères à une exigence
- **Progression**: Clic sur "Ajouter Critère" → Saisir le texte du critère → La case à cocher apparaît → Cliquer pour basculer réussite/échec → L'état persiste
- **Critères de succès**: Chaque exigence peut avoir plusieurs cases à cocher qui maintiennent leur état et sont incluses dans les exports

### Export/Import JSON
- **Fonctionnalité**: Sauvegarder toutes les données de test (articles, exigences, critères, images) dans un fichier JSON et recharger des tests sauvegardés précédemment
- **But**: Permettre la persistance des données, la sauvegarde et le partage de cahiers d'essais entre membres d'équipe
- **Déclencheur**: Cliquer sur les boutons "Exporter JSON" ou "Importer JSON"
- **Progression**: Export: Clic sur bouton → Le navigateur télécharge le fichier JSON avec toutes les données | Import: Clic sur bouton → Sélectionner le fichier → Toutes les données se chargent dans l'application
- **Critères de succès**: Le JSON exporté contient tout le texte, les états des cases à cocher et les images encodées en base64; les fichiers importés restaurent complètement l'état de l'application

## Gestion des Cas Limites
- **États Vides**: Afficher des invites utiles quand aucun article de test ou exigence n'existe
- **Images Volumineuses**: Afficher un avertissement si l'image collée dépasse 2Mo; suggérer une optimisation
- **Import JSON Invalide**: Afficher un message d'erreur avec le problème spécifique (JSON malformé, mauvais schéma)
- **Changements Non Sauvegardés**: Persister les données dans localStorage automatiquement pour prévenir la perte lors d'une fermeture accidentelle
- **Texte d'Exigence Long**: Auto-expansion des zones de texte et maintien de la lisibilité avec un retour à la ligne approprié

## Direction de Design
Le design devrait évoquer un sentiment de cahier de laboratoire professionnel - propre, organisé et digne de confiance comme une documentation scientifique, avec une sophistication technique subtile à travers une typographie de précision et une mise en page structurée.

## Sélection de Couleurs

- **Couleur Primaire**: Bleu Technique Profond `oklch(0.45 0.15 250)` - Communique la précision, la fiabilité et l'expertise technique
- **Couleurs Secondaires**: 
  - Ardoise Neutre `oklch(0.96 0.005 250)` pour les arrière-plans - Crée un espace de travail propre
  - Charbon `oklch(0.30 0.01 250)` pour le texte - Professionnel et lisible
- **Couleur d'Accent**: Vert de Succès `oklch(0.65 0.18 145)` pour les cases à cocher et actions positives - Retour visuel clair pour les tests réussis
- **Paires Premier Plan/Arrière-Plan**: 
  - Bleu Primaire (oklch(0.45 0.15 250)): Texte blanc (oklch(0.99 0 0)) - Ratio 8.2:1 ✓
  - Arrière-plan Neutre (oklch(0.96 0.005 250)): Texte charbon (oklch(0.30 0.01 250)) - Ratio 11.5:1 ✓
  - Vert d'Accent (oklch(0.65 0.18 145)): Texte blanc (oklch(0.99 0 0)) - Ratio 5.8:1 ✓

## Sélection de Police
Les polices devraient équilibrer la précision technique avec une excellente lisibilité pour le travail de documentation - une sans-serif technique pour les éléments d'interface couplée avec une monospace très lisible pour les données de test.

- **Hiérarchie Typographique**:
  - H1 (Titre de l'App): Space Grotesk Bold / 32px / -0.02em espacement des lettres
  - H2 (Noms des Articles de Test): Space Grotesk SemiBold / 24px / -0.01em
  - H3 (En-têtes d'Exigences): Space Grotesk Medium / 18px / normal
  - Corps (Interface Générale): Inter Regular / 15px / normal / 1.6 hauteur de ligne
  - Monospace (IDs, JSON): JetBrains Mono Regular / 14px / 0.5ch espacement des lettres

## Animations
Les animations devraient paraître précises et techniques, avec des transitions rapides et ciblées qui soulignent la nature structurée de la documentation de test - expansions fluides pour l'ajout d'articles, confirmations subtiles de cases à cocher, et fondus rapides pour le nouveau contenu.

## Sélection de Composants

- **Composants**:
  - `Card` avec ombres subtiles pour les articles de test - sections organisées et contenues
  - `Accordion` pour les exigences repliables - utilisation efficace de l'espace
  - `Checkbox` pour les critères de réussite/échec - interaction claire et accessible
  - `Button` variantes (défaut pour actions primaires, outline pour secondaires) - hiérarchie d'action claire
  - `Textarea` auto-redimensionnable pour le texte d'exigence - saisie flexible
  - `Input` pour les noms d'articles de test et les libellés de critères
  - `Dialog` pour l'import JSON et les actions de confirmation
  - `Badge` pour afficher les comptes et statuts d'exigences
  - `Separator` pour diviser les sections
  - `ScrollArea` pour les longues listes d'exigences
  
- **Personnalisations**:
  - Composant personnalisé de téléchargement/collage d'image avec prévisualisation et rendu en ligne
  - Visualiseur JSON personnalisé pour déboguer les exports
  - Composant d'éditeur de texte enrichi avec capacité d'intégration d'images
  - Réorganisation par glisser-déposer pour les exigences
  
- **États**:
  - Boutons: Réduction d'échelle subtile à la pression, changement de couleur au survol
  - Cases à cocher: Animation fluide de coche avec surbrillance verte
  - Cartes: Ombre élevée au survol pour les articles de test, surbrillance de bordure quand sélectionné
  - Champs: État focalisé avec anneau bleu et changement d'arrière-plan subtil
  
- **Sélection d'Icônes**:
  - `Plus` pour ajouter des articles/exigences/critères
  - `Trash` pour les actions de suppression
  - `Image` pour les déclencheurs de téléchargement d'image
  - `DownloadSimple` pour l'export JSON
  - `UploadSimple` pour l'import JSON
  - `FloppyDisk` pour les indicateurs de sauvegarde
  - `Check` pour les critères complétés
  - `ClipboardText` pour les articles de test
  
- **Espacement**: 
  - Padding du conteneur: `p-6`
  - Padding de carte: `p-4`
  - Écarts de section: `gap-6`
  - Écarts d'éléments de liste: `gap-3`
  - Espacement en ligne: `gap-2`
  
- **Mobile**: 
  - Empiler les articles de test verticalement sur mobile
  - Cartes pleine largeur sous 768px
  - Bouton d'action flottant pour "Ajouter" sur mobile
  - Les boutons côte à côte deviennent empilés
  - Padding réduit (p-4 au lieu de p-6)

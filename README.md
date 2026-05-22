# Labyrinth — Application Desktop (Electron / SQLite)

Ce projet est une application desktop multiplateforme développée avec Electron. Elle permet de générer des labyrinthes parfaits, de les résoudre de manière automatisée, et de gérer un historique de sauvegardes propre à chaque utilisateur.

Développé dans le cadre d'un cursus en Cybersécurité (B1), l'accent a été mis sur la robustesse de l'architecture et la protection des données locales.

---

## 🛠️ Spécifications techniques

### Architecture & Sécurité (Focus Cyber)
* **Isolation des processus :** L'application implémente `contextIsolation: true` et désactive `nodeIntegration`. Le processus de rendu (l'interface) n'a aucun accès direct au système ou à Node.js, ce qui neutralise les risques d'exécution de code malveillant (XSS).
* **Passerelle IPC :** Toutes les interactions entre l'interface et la machine passent par une API sécurisée et bridée dans `preload.js`.
* **Persistance des données :** Base de données relationnelle locale stockée dans un fichier SQLite3 (`labyrinth.db`).
* **Cryptographie :** Mots de passe hachés à sens unique avec `bcryptjs` (facteur de coût de 10 + sel aléatoire). Session utilisateur structurée via des jetons JWT (`jsonwebtoken`).

### Les Algorithmes de théorie des graphes
* **Génération :** Algorithme de parcours en profondeur (DFS - *Depth-First Search*) avec retour sur trace (*Backtracking*). Il garantit un labyrinthe parfait, sans boucle, avec un chemin unique vers la sortie.
* **Résolution :** Algorithme de parcours en largeur (BFS - *Breadth-First Search*). Il explore la grille niveau par niveau pour garantir la découverte visuelle du chemin le plus court.

---

## 🎮 Fonctionnalités de l'application

1. **Système d'authentification :** Inscription et connexion sécurisées. Une fois connecté, l'utilisateur accède à son espace personnel.
2. **Génération sur-mesure :** Choix de la taille du labyrinthe (petit, moyen, grand) combiné à un curseur de difficulté variable (1 à 10) qui ajuste dynamiquement la taille de la matrice.
3. **Résolution animée :** Un bouton permet de lancer l'algorithme BFS pour voir le tracé se dessiner en temps réel sur le canvas.
4. **CRUD complet des sauvegardes :** * *Création :* Sauvegarde instantanée de la grille en cours (linéarisée au format JSON en base de données).
   * *Lecture :* Liste des labyrinthes personnels disponible en bas de l'écran avec option de chargement immédiat.
   * *Mise à jour :* Modification dynamique du nom du labyrinthe directement depuis l'interface (sans freeze système).
   * *Suppression :* Nettoyage de l'historique en un clic.

---

## 🚀 Installation et Lancement

### Prérequis
Avoir installé [Node.js](https://nodejs.org/) (version LTS recommandée).

### 1. Installation des dépendances
Ouvrez un terminal à la racine du projet et installez les modules requis (Electron, SQLite3, Bcrypt, etc.) :
```bash
npm install
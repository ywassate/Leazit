#  LeazIt – Plateforme de location de voitures par abonnement

LeazIt est une application web moderne de **location de voitures par abonnement**.  
Elle permet aux utilisateurs de parcourir les véhicules disponibles, comparer les offres, simuler un devis et gérer leur abonnement en ligne (profil, paiements, réservations).  

---

##  Fonctionnalités principales

- **Page d’accueil dynamique**
  - Hero fullscreen avec logos de marques partenaires
  - Statistiques clés et proposition de valeur
  - Témoignages clients et FAQ

- **Catalogue & Marques**
  - Navigation par **catégorie de véhicules** (compact, mini SUV, SUV, utilitaire)
  - Pages dédiées à chaque **marque** avec description et modèles disponibles
  - Filtres avancés et affichage **grille/liste**

- **Simulateur interactif**
  - Carrousel des modèles disponibles
  - Choix de l’engagement, kilométrage et assurances
  - Calcul automatique du prix du devis
  - Affichage **plein écran sur mobile**

- **Réservation en ligne (4 étapes)**
  1. Informations client (particulier ou entreprise)
  2. Téléversement de documents
  3. Signature électronique & CGV
  4. Paiement sécurisé (Stripe)

- **Espace utilisateur**
  - Profil (infos personnelles, adresse, téléphone avec pays)
  - Mon abonnement (vue d’ensemble)
  - Modes de paiement (ajout/suppression de cartes)
  - Historique des réservations et paiements
  - Avatar avec initiales + menu dropdown

- **Intégrations techniques**
  - **Firebase Auth** : authentification sécurisée
  - **Firestore** : stockage des véhicules, utilisateurs, réservations
  - **Stripe** : paiements et gestion des cartes
  - **API interne (Node/Express)** 

---

##  Stack technique

- **Frontend :**
  - React + TypeScript
  - Tailwind CSS
  - Framer Motion (animations)
  - Lucide React (icônes)

- **Backend :**
  - Firebase Firestore (base de données NoSQL)
  - Firebase Auth (authentification)
  - Firebase Functions (sécurité & logique server-side)
  - Stripe (à venir)

---


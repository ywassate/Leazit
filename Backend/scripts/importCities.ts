// scripts/importCities.ts
import { db } from '../src/config/firebase';
import { cities } from './cities';

async function importCities() {
  const batch = db.batch();
  const citiesCollection = db.collection('cities');

  for (const city of cities) {
    const docRef = citiesCollection.doc(city.nom.toLowerCase());
    batch.set(docRef, city);
  }

  try {
    await batch.commit();
    console.log('✅ Villes importées avec succès dans Firestore.');
  } catch (error) {
    console.error('❌ Erreur lors de l’importation des villes :', error);
  }
}

importCities();

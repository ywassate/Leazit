// backend/scripts/importCars.ts

import { db } from '../src/config/firebase'; 
import { cars } from './carsData'; 

async function importCars() {
  try {
    const batch = db.batch();

    for (const car of cars) {
      const ref = db.collection('vehicles').doc(car.id);
      batch.set(ref, car);
    }

    await batch.commit();
    console.log(' Données des voitures importées avec succès dans Firestore.');
  } catch (error) {
    console.error(' Erreur lors de l’importation :', error);
  }
}

importCars();

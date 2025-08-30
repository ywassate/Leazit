// scripts/importBrands.ts
import { db } from '../src/config/firebase';
import { brandData } from './brandData';

async function importBrands() {
  const batch = db.batch();

  for (const brand of brandData) {
    const docRef = db.collection('brands').doc(brand.id);
    batch.set(docRef, {
      name: brand.name,
      logo: brand.logo,
      imageDescription: brand.imageDescription,
      description: brand.description,
      buttonLabel: brand.buttonLabel,
      models: brand.models,
    });
  }

  try {
    await batch.commit();
    console.log('✅ Données des marques importées avec succès dans Firestore.');
  } catch (error) {
    console.error('❌ Erreur lors de l’importation des marques :', error);
  }
}

importBrands();

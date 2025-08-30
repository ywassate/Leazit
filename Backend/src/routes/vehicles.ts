import { Router } from 'express';
import { db } from '../config/firebase';
import { send404 } from '../middleware/errorHandlers';

const router = Router();

// GET /api/vehicles
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const ref = db.collection('vehicles');
    const snap = category
      ? await ref.where('category', '==', category).get()
      : await ref.get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/vehicles/:id
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('vehicles').doc(req.params.id).get();
    if (!doc.exists) return res.status(404).json({ message: 'Véhicule introuvable' });
    return res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});


export default router;
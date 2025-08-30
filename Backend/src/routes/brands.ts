import { Router } from 'express';
import { db } from '../config/firebase';
import { send404 } from '../middleware/errorHandlers';

const router = Router();

// GET /api/brands
router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('brands').get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/brands/:id
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('brands').doc(req.params.id).get();
    if (!doc.exists) return send404(res, 'Marque introuvable');
    return res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
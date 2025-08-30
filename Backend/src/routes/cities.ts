import { Router } from 'express';
import { db } from '../config/firebase';

const router = Router();

// GET /api/cities
router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('cities').get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
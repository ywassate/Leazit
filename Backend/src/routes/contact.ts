import { Router } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../config/firebase';
import { send404 } from '../middleware/errorHandlers';

const router = Router();

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    }
    
    const ref = db.collection('contact_messages').doc();
    await ref.set({
      ...req.body,
      status: 'new',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    return res.status(201).json({ success: true, id: ref.id });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/contact
router.get('/', async (req, res) => {
  try {
    const snap = await db.collection('contact_messages').get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// GET /api/contact/:id
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('contact_messages').doc(req.params.id).get();
    if (!doc.exists) return send404(res, 'Message introuvable');
    return res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

// PUT /api/contact/:id/status
router.put('/:id/status', async (req, res) => {
  try {
    await db.collection('contact_messages').doc(req.params.id).update({
      status: req.body.status,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// DELETE /api/contact/:id
router.delete('/:id', async (req, res) => {
  try {
    await db.collection('contact_messages').doc(req.params.id).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
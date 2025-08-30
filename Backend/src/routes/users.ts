import { Router } from 'express';
import * as admin from 'firebase-admin';
import { db } from '../config/firebase';
import { send404 } from '../middleware/errorHandlers';

const router = Router();

// SUBSCRIPTION ROUTES
router.route('/:userId/subscription')
  .get(async (req, res) => {
    try {
      const doc = await db.doc(`users/${req.params.userId}/subscription/current`).get();
      if (!doc.exists) return send404(res, 'Abonnement introuvable');
      return res.json(doc.data()); 
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur' }); 
    }
  })
  .post(async (req, res) => {
    try {
      await db.doc(`users/${req.params.userId}/subscription/current`).set(req.body);
      return res.json({ success: true }); 
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur' }); 
    }
  });


// PAYMENTS & CARDS ROUTES
['payments', 'cards'].forEach(type => {
  router.get(`/:userId/${type}`, async (req, res) => {
    try {
      const snap = await db.collection(`users/${req.params.userId}/${type}`).get();
      res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
  
  router.post(`/:userId/${type}`, async (req, res) => {
    try {
      const ref = db.collection(`users/${req.params.userId}/${type}`).doc();
      await ref.set(req.body);
      res.json({ success: true, id: ref.id });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });
});

// PROFILE ROUTES
router.route('/:userId/profile')
  .get(async (req, res) => {
    try {
      const doc = await db.collection('users').doc(req.params.userId).get();
      if (!doc.exists) return send404(res, 'PROFILE_NOT_FOUND');
      return res.json({ id: doc.id, ...doc.data() });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  })
  .post(async (req, res) => {
    try {
      const ref = db.collection('users').doc(req.params.userId);
      const doc = await ref.get();
      if (doc.exists) return res.json({ success: true, ...doc.data() });
      
      await ref.set({
        ...req.body,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      return res.status(201).json({ success: true });
    } catch (error) {
      return res.status(500).json({ message: 'Erreur serveur' });
    }
  })
  .put(async (req, res) => {
    try {
      const ref = db.collection('users').doc(req.params.userId);
      await ref.update({
        ...req.body,
        updatedAt: admin.firestore.FieldValue.serverTimestamp()
      });
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  })
  .delete(async (req, res) => {
    try {
      await db.collection('users').doc(req.params.userId).delete();
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: 'Erreur serveur' });
    }
  });

// RESERVATIONS ROUTES
router.get('/:userId/reservations', async (req, res) => {
  try {
    const snap = await db.collection(`users/${req.params.userId}/reservations`).get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/:userId/reservations', async (req, res) => {
  try {
    const ref = db.collection(`users/${req.params.userId}/reservations`).doc();
    await ref.set({
      ...req.body,
      userId: req.params.userId,
      status: 'pending',
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(201).json({ success: true, id: ref.id });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.get('/:userId/reservations/:reservationId', async (req, res) => {
  try {
    const doc = await db.collection(`users/${req.params.userId}/reservations`).doc(req.params.reservationId).get();
    if (!doc.exists) return send404(res, 'Réservation introuvable');
    return res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    return res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:userId/reservations/:reservationId', async (req, res) => {
  try {
    await db.collection(`users/${req.params.userId}/reservations`).doc(req.params.reservationId)
      .update({ ...req.body, updatedAt: admin.firestore.FieldValue.serverTimestamp() });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:userId/reservations/:reservationId', async (req, res) => {
  try {
    await db.collection(`users/${req.params.userId}/reservations`).doc(req.params.reservationId).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// FAVORITES ROUTES
router.get('/:userId/favorites', async (req, res) => {
  try {
    const snap = await db.collection(`users/${req.params.userId}/favorites`).get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/:userId/favorites', async (req, res) => {
  try {
    const ref = db.collection(`users/${req.params.userId}/favorites`).doc(req.body.vehicleId);
    await ref.set({ ...req.body, addedAt: admin.firestore.FieldValue.serverTimestamp() });
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.delete('/:userId/favorites/:vehicleId', async (req, res) => {
  try {
    await db.collection(`users/${req.params.userId}/favorites`).doc(req.params.vehicleId).delete();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// NOTIFICATIONS ROUTES
router.get('/:userId/notifications', async (req, res) => {
  try {
    const snap = await db.collection(`users/${req.params.userId}/notifications`).get();
    res.json(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.post('/:userId/notifications', async (req, res) => {
  try {
    const ref = db.collection(`users/${req.params.userId}/notifications`).doc();
    await ref.set({
      ...req.body,
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    res.status(201).json({ success: true, id: ref.id });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:userId/notifications/:notificationId/read', async (req, res) => {
  try {
    await db.collection(`users/${req.params.userId}/notifications`).doc(req.params.notificationId)
      .update({ read: true, readAt: admin.firestore.FieldValue.serverTimestamp() });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

router.put('/:userId/notifications/read-all', async (req, res) => {
  try {
    const snap = await db.collection(`users/${req.params.userId}/notifications`).where('read', '==', false).get();
    const batch = db.batch();
    snap.docs.forEach(doc => batch.update(doc.ref, { read: true, readAt: admin.firestore.FieldValue.serverTimestamp() }));
    await batch.commit();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

export default router;
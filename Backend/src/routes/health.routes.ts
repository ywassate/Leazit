//src/routes/health.routes.ts

import express from 'express';

const router = express.Router();

router.get('/', (_, res) => {
  res.status(200).json({ status: 'ok', message: 'API backend opérationnelle ✅' });
});

export default router;

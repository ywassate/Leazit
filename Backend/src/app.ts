import express from 'express';
import cors from 'cors';
import vehicleRoutes from './routes/vehicles';
import cityRoutes from './routes/cities';
import brandRoutes from './routes/brands';
import userRoutes from './routes/users';
import contactRoutes from './routes/contact';
import { errorHandler, notFoundHandler } from './middleware/errorHandlers';

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware global
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/brands', brandRoutes);
app.use('/api/users', userRoutes);
app.use('/api/contact', contactRoutes);

// Gestionnaires d'erreur
app.use(notFoundHandler);
app.use(errorHandler);

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`✅ Backend: http://localhost:${PORT}`);
});

export default app;
import express from 'express';

// inicializamos el env
import dotenv from 'dotenv';
import { Container } from './DI/Container';
import { CSVData } from './Infrastructure/Data/CSV_Data';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 80;
const MONGO_ROOT_USER = process.env.MONGO_ROOT_USER || 'admin';
const MONGO_ROOT_PASSWORD = process.env.MONGO_ROOT_PASSWORD || 'password123';
const DB_NAME = process.env.DB_NAME || 'example_clients_db';
const JWT_SECRET = process.env.JWT_SECRET || 'secret_secret_secret_secret_secret_secret';

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || 'your_api_key';
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || 'your_api_secret';

const CSV_Data = new CSVData();


// Middleware
app.use(express.json());


// Health check

export async function bootstrap() {
  try {
    app.get('/health', (req, res) => {
      res.json({ status: 'OK', timestamp: new Date().toISOString() });
    });

    
    // Initialize container
    const container = Container.getInstance();
    await container.initialize(
      MONGO_ROOT_USER,
      MONGO_ROOT_PASSWORD,
      DB_NAME,
      JWT_SECRET,
      CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET,
      await CSV_Data.getVulneablePasswordsData()
    );

    // Swagger
    container.initSwagger(app);

    // Setup routes WITHOUT global validation middleware
    const userRoutes = container.getUserRoutes();
    app.use('/api/users', userRoutes.getRouter());

    const clientRoutes = container.getClientRoutes();
    app.use('/api/clients', clientRoutes.getRouter());

    const passwordRoutes = container.getPasswordRoutes();
    app.use('/api/v1/password', passwordRoutes.getRouter());

    // Global error handler
    app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Unhandled error:', err);
      res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'An unexpected error occurred'
      });
    });

    // 404 handler
    app.use((req, res) => {
      res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'The requested resource was not found'
      });
    });

    // Start server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`Create user: POST http://localhost:${PORT}/api/users`);
    });

    // Graceful shutdown
    process.on('SIGTERM', async () => {
      console.log('Received SIGTERM, shutting down gracefully');
      await container.shutdown();
      process.exit(0);
    });

    process.on('SIGINT', async () => {
      console.log('Received SIGINT, shutting down gracefully');
      await container.shutdown();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}
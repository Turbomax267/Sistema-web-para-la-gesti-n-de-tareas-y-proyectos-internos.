import dotenv from 'dotenv';
import app from './app';
import { connectMongoDB } from './config/mongodb';
import { connectMySQL } from './config/mysql';

dotenv.config();

const PORT = Number(process.env.PORT || 3000);

async function bootstrap(): Promise<void> {
  try {
    await connectMySQL();
    console.log('MySQL conectado correctamente');

    await connectMongoDB();
    console.log('MongoDB conectado correctamente');

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('No fue posible iniciar el backend:', error);
    process.exit(1);
  }
}

bootstrap();


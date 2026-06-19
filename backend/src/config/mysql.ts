import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

export const mysqlPool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  port: Number(process.env.MYSQL_PORT || 3306),
  database: process.env.MYSQL_DATABASE || 'gestor_proyectos',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  namedPlaceholders: false,
});

export async function connectMySQL(): Promise<void> {
  const connection = await mysqlPool.getConnection();
  await connection.ping();
  connection.release();
}


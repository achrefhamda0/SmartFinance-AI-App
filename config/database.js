import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool;

const getPool = () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || '127.0.0.1',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'smartfinance',
      waitForConnections: true,
      connectionLimit: Number(process.env.DB_POOL_SIZE || 10),
      queueLimit: 0,
      charset: 'utf8mb4',
      timezone: 'Z',
      namedPlaceholders: true
    });
  }
  return pool;
};

export const query = async (sql, params = {}) => {
  const [rows] = await getPool().execute(sql, params);
  return rows;
};

export const transaction = async (work) => {
  const connection = await getPool().getConnection();
  try {
    await connection.beginTransaction();
    const result = await work(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export const closePool = async () => {
  if (!pool) return;
  await pool.end();
  pool = undefined;
};
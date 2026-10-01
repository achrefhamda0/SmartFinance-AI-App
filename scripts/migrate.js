/**
 * Applique db/schema.sql sur la base configurée dans .env.
 *
 *   npm run db:migrate
 *
 * Le script est idempotent : toutes les créations utilisent IF NOT EXISTS,
 * il peut donc être rejoué sans risque sur un environnement existant.
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const schemaPath = path.join(root, 'db/schema.sql');

const connection = await mysql.createConnection({
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
});

try {
  const sql = await fs.readFile(schemaPath, 'utf8');
  await connection.query(sql);

  const [tables] = await connection.query('SHOW TABLES');
  console.log(`[migrate] ${tables.length} table(s) prêtes :`);
  console.log(tables.map((row) => `  · ${Object.values(row)[0]}`).join('\n'));
} catch (error) {
  console.error('[migrate] échec :', error.code ?? '', error.message);
  process.exitCode = 1;
} finally {
  await connection.end();
}
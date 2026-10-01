import crypto from 'node:crypto';
import { promisify } from 'node:util';
import { query } from '../config/database.js';

const scrypt = promisify(crypto.scrypt);

const FIELDS = 'id, first_name AS firstName, last_name AS lastName, company, email, role, password_hash AS passwordHash, created_at AS createdAt';

export const findUserByEmail = async (email) => {
  const rows = await query(`SELECT ${FIELDS} FROM users WHERE email = :email LIMIT 1`, { email });
  return rows[0] ?? null;
};

export const findUserById = async (id) => {
  const rows = await query(`SELECT ${FIELDS} FROM users WHERE id = :id LIMIT 1`, { id });
  return rows[0] ?? null;
};

export const createUser = async ({ firstName, lastName, company, email, role, password }) => {
  const result = await query(
    `INSERT INTO users (first_name, last_name, company, email, role, password_hash)
     VALUES (:firstName, :lastName, :company, :email, :role, :passwordHash)`,
    {
      firstName,
      lastName,
      company,
      email,
      role,
      passwordHash: password
    }
  );
  return findUserById(result.insertId);
};

/** Compare le mot de passe saisi au hash scrypt stocké, à temps constant. */
export const verifyPassword = async (password, stored) => {
  const [algorithm, salt, hash] = String(stored).split('$');
  if (algorithm !== 'scrypt' || !salt || !hash) return false;

  const expected = Buffer.from(hash, 'hex');
  const derived = await scrypt(password, Buffer.from(salt, 'hex'), expected.length);
  return crypto.timingSafeEqual(derived, expected);
};

export const publicUser = (user) =>
  user && {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    company: user.company,
    email: user.email,
    role: user.role
  };
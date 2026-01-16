import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Esto le dice: "Subí dos niveles y buscá el .env"
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// 2. LOG DE SEGURIDAD (Para que veas en la consola si funciona)
console.log('Intentando conectar con usuario:', process.env.DB_USER);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10
});

export default pool;
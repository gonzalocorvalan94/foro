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
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Al final de tu archivo de base de datos
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('✅ ¡Conexión exitosa a TiDB Cloud!');
    connection.release();
  } catch (err) {
    console.error('❌ Error crítico de conexión:', err.message);
    console.error('Código de error:', err.code); // Esto nos dirá si es "ETIMEDOUT", "ECONNREFUSED", etc.
  }
};

testConnection();
export default pool;
import pool from "../config/db.js";

export const createUser = async(username, email, password)=>{
  const [result] = await pool.query(
    'INSERT INTO users (Username, Email, Password) VALUES (?, ?, ?)', [username, email, password]
  )
  return result.insertId;
}

export const getUserByEmail = async(email)=>{
  const [rows] = await pool.query(
    'SELECT * FROM users WHERE Email = ?', [email]
  )
  return rows[0];
}

export const getAllUsersFromDB = async () => {
  // Traemos solo lo necesario. La seguridad ante todo.
  const [rows] = await pool.query(
    'SELECT ID, Username, Email, Role, created_at FROM users ORDER BY Username ASC'
  );
  return rows;
};
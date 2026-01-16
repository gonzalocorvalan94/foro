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
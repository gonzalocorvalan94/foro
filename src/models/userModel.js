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

export const getUserByUsername = async (username) => {
  const [rows] = await pool.query('SELECT * FROM users WHERE Username = ?', [username]);
  return rows[0];
};

export const createUserWithSecurity = async (username, email, hashedPassword, question, hashedAnswer) => {
  const [result] = await pool.query(
    'INSERT INTO users (Username, Email, Password, Security_question, Security_answer) VALUES (?, ?, ?, ?, ?)',
    [username, email, hashedPassword, question, hashedAnswer]
  );
  return result.insertId;
};

export const updatePassword = async (userId, hashedPassword) => {
  await pool.query('UPDATE users SET Password = ? WHERE ID = ?', [hashedPassword, userId]);
};
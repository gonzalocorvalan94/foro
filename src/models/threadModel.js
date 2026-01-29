import pool from '../config/db.js';

// 1. CREAR (No se toca, el JOIN no hace falta acá)
export const createThread = async (Title, Content, userId, categoryId) => {
  const [result] = await pool.query(
    'INSERT INTO threads (Title, Content, user_id, category_id) VALUES (?, ?, ?, ?)',
    [Title, Content, userId, categoryId]
  );
  return result.insertId;
};

// 2. LEER TODOS (Ya está perfecta, usala para el Home)
export const getAllThreads = async (limit, offset) => {
  const [rows] = await pool.query(
    `SELECT t.*, u.Username as authorName 
     FROM threads t 
     JOIN users u ON t.user_id = u.ID 
     ORDER BY t.created_at DESC 
     LIMIT ? OFFSET ?`, 
    [limit, offset]
  );
  return rows;
};

// 3. LEER UNO SOLO (Cambié 'Author' por 'authorName' para que sea igual a la de arriba)
export const getThreadById = async (id) => {
  const [rows] = await pool.query(
    `SELECT t.*, u.Username AS authorName 
     FROM threads t 
     JOIN users u ON t.user_id = u.ID 
     WHERE t.ID = ?`, 
    [id]
  );
  return rows[0];
};

// 4. RESPUESTAS (Ya está perfecta con authorName)
export const getRepliesByThreadId = async (threadId) => {
  const [rows] = await pool.query(
    `SELECT r.*, u.Username as authorName 
     FROM replies r 
     JOIN users u ON r.user_id = u.ID 
     WHERE r.thread_id = ? 
     ORDER BY r.Created_at ASC`,
    [threadId]
  );
  return rows;
};

// 5. UPDATE Y DELETE (No se tocan)
export const updateThread = async (ID, Title, Content) => {
  const [result] = await pool.query('UPDATE threads SET Title = ?, Content = ? WHERE ID = ?', [Title, Content, ID]);
  return result.affectedRows;
};

export const deleteThread = async (ID) => {
  const [result] = await pool.query('DELETE FROM threads WHERE ID = ?', [ID]);
  return result.affectedRows;
};
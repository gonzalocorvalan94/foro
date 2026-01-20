import pool from '../config/db.js';

export const createThread = async (Title, Content, userId, categoryId) => {
  const [result] = await pool.query(
    'INSERT INTO threads (Title, Content, user_id, category_id) VALUES (?, ?, ?, ?)',
    [Title, Content, userId, categoryId]
  );
  return result.insertId;
};

export const getAllThreads = async () => {
  const [rows] = await pool.query(
    `SELECT 
        t.ID, 
        t.Title, 
        t.Content, 
        t.Created_at, 
        u.Username AS Author, 
        c.Name AS Category
    FROM threads t
    JOIN users u ON t.user_id = u.ID
    JOIN categories c ON t.category_id = c.ID
    ORDER BY t.Created_at DESC`
  );
  return rows;
};

export const updateThread = async (ID, Title, Content) => {
  const [result] = await pool.query(
    'UPDATE threads SET Title = ?, Content = ? WHERE ID = ?',
    [Title, Content, ID]
  );
  return result.affectedRows;
};

export const deleteThread = async (ID) => {
  const [result] = await pool.query('DELETE FROM threads WHERE ID = ?', [ID]);
  return result.affectedRows;
};

export const getThreadById = async (ID) => {
  const [rows] = await pool.query('SELECT * FROM threads WHERE ID = ?', [ID]);
  return rows[0];
};

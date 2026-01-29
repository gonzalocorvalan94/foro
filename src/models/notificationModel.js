import pool from "../config/db.js";

export const createNotification = async (userId, triggerUserId, threadId, type) => {
  
  const [result] = await pool.query(
    'INSERT INTO notifications (user_id, trigger_user_id, thread_id, type) VALUES (?, ?, ?, ?)',
    [userId, triggerUserId, threadId, type]
  );

  return result.insertId;
};

export const getNotificationsByUser = async (userId) => {
  const [rows] = await pool.query(
    `SELECT 
        n.ID, 
        n.type, 
        n.is_read, 
        n.created_at, 
        u.Username AS triggerUserName, 
        t.Title AS threadTitle
     FROM notifications n
     JOIN users u ON n.trigger_user_id = u.ID
     JOIN threads t ON n.thread_id = t.ID
     WHERE n.user_id = ?
     ORDER BY n.created_at DESC`,
    [userId]
  );
  return rows;
};

export const markNotificationAsRead = async (notificationId, userId) => {
  // Pedimos el userId por seguridad, para que nadie marque como leída 
  // una notificación que no le pertenece.
  const [result] = await pool.query(
    'UPDATE notifications SET is_read = TRUE WHERE ID = ? AND user_id = ?',
    [notificationId, userId]
  );
  return result.affectedRows > 0;
};
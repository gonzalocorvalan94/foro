import pool from "../config/db.js";
import fs from 'fs/promises'
import path from "path";

export const createReply = async (content, userId, threadId, parentReplyId, imageUrl) => {
  const [result] = await pool.query(
    'INSERT INTO replies (Content, user_id, thread_id, parent_reply_id, Image_url) VALUES (?, ?, ?, ?, ?)',
    [content, userId, threadId, parentReplyId, imageUrl]
  );
  return result.insertId;
};

export const getRepliesByThreadId = async (threadId) => {
  const [rows] = await pool.query(
  `SELECT 
    r.ID, 
    r.Content, 
    r.Created_at, 
    r.parent_reply_id, 
    r.Image_url,  -- <--- ¡ESTA ES LA QUE FALTA AGREGAR!
    u.username AS authorName 
   FROM replies r
   JOIN users u ON r.user_id = u.ID
   WHERE r.thread_id = ?`,
  [threadId]
);
  return rows;
};

export const getReplyById = async(id) =>{
  const [rows] = await pool.query('SELECT * from replies WHERE ID = ?', [id]);

  return rows[0];
}

export const updateReply = async(id, content)=>{
  const [result] = await pool.query('UPDATE replies SET Content = ? WHERE ID = ?', [content, id]);

  return result.affectedRows
}

export const deleteReply = async(id)=>{
  const [result] = await pool.query('DELETE FROM replies WHERE ID = ?', [id])

  return result.affectedRows;
}



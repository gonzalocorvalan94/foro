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


//esta funcion es para eliminar las fotos que los usuarios eliminaron. ASi no quedan ocpando espacio
export const deleteFile = async (relativeUrl) => {
  if (!relativeUrl) return;

  // Construimos la ruta absoluta (desde la raíz del proyecto hasta la carpeta public)
  const filePath = path.join(process.cwd(), 'public', relativeUrl);
  
  try {
    await fs.unlink(filePath);
    console.log(`Archivo eliminado: ${filePath}`);
  } catch (err) {
    // Si el archivo no existe, no pasa nada, seguimos
    console.error(`No se pudo borrar el archivo: ${err.message}`);
  }
};
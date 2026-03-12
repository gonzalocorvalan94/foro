import path from 'path';
import fs from 'fs/promises';

export const deleteFile = async (relativeUrl) => {
  if (!relativeUrl) return;

  const filePath = path.join(process.cwd(), 'public', relativeUrl);
  
  try {
    await fs.unlink(filePath);
    console.log(`Archivo eliminado: ${filePath}`);
  } catch (err) {
    console.error(`No se pudo borrar el archivo: ${err.message}`);
  }
};
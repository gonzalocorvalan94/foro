import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Estas dos líneas sirven para obtener la ruta de la carpeta actual en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Explicación: 
    // __dirname es '.../src/utils'
    // '..' sale a 'src'
    // '..' sale a la raíz 'foro'
    // Ahí busca 'public/img/replies'
    const rootPath = path.join(__dirname, '..', '..', 'public', 'img', 'replies');
    cb(null, rootPath);
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `reply-${req.user.ID}-${Date.now()}.${ext}`);
  }
});

// Filtro para que solo suban imágenes (¡Seguridad!)
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new Error('No es una imagen. Por favor sube solo fotos.'), false);
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: multerFilter
});
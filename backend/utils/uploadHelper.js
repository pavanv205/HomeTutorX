const multer = require('multer');
const path = require('path');
const fs = require('fs');

let storage;
let hasCloudinary = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET);

if (hasCloudinary) {
  try {
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    const cloudinary = require('cloudinary').v2;
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    storage = new CloudinaryStorage({
      cloudinary: cloudinary,
      params: async (req, file) => {
        const filename = file.originalname.toLowerCase();
        const isPdf = file.mimetype === 'application/pdf' || filename.endsWith('.pdf');
        return {
          folder: 'tutor_profiles',
          resource_type: isPdf ? 'raw' : 'image',
          format: isPdf ? 'pdf' : undefined,
        };
      }
    });
  } catch (err) {
    console.warn('⚠️ Cloudinary setup failed, falling back to local storage:', err.message);
    hasCloudinary = false;
  }
}

if (!hasCloudinary) {
  const uploadDir = path.join(__dirname, '..', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }
  storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
}

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  const filename = file.originalname.toLowerCase();
  
  if (filename.includes('.trashed-') || filename.startsWith('.trashed-')) {
    console.error(`[UPLOAD REJECTED] Rejected temporary trashed file: ${file.originalname}`);
    return cb(new Error('Invalid file type: temporary trashed files are not allowed'), false);
  }

  if (file.fieldname === 'resume') {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const hasAllowedExt = allowedExts.some(ext => filename.endsWith(ext));
    const hasAllowedMime = allowedMimeTypes.includes(file.mimetype);
    
    if (hasAllowedMime || hasAllowedExt) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type: Profile Photo must be JPG, JPEG, PNG, or WEBP'), false);
    }
  } else if (file.fieldname === 'certificate') {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf'];
    const hasAllowedExt = allowedExts.some(ext => filename.endsWith(ext));
    const hasAllowedMime = allowedMimeTypes.includes(file.mimetype);
    
    if (hasAllowedMime || hasAllowedExt) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type: Educational Certificate must be PDF, JPG, JPEG, or PNG'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB size limit
  fileFilter
});

const getFileUrl = (file) => {
  if (!file) return null;
  if (hasCloudinary && file.path) {
    return file.path;
  }
  return `/uploads/${file.filename}`;
};

module.exports = {
  upload,
  getFileUrl
};

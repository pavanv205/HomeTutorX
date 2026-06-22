const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage dynamically to handle images & raw files (like PDFs)
const storage = new CloudinaryStorage({
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

// File filter to validate file types and reject temporary trashed files
const fileFilter = (req, file, cb) => {
  const filename = file.originalname.toLowerCase();
  
  // 1. Reject invalid temporary files
  if (filename.includes('.trashed-') || filename.startsWith('.trashed-')) {
    console.error(`[UPLOAD REJECTED] Rejected temporary trashed file: ${file.originalname}`);
    return cb(new Error('Invalid file type: temporary trashed files are not allowed'), false);
  }

  // 2. Validate based on field name
  if (file.fieldname === 'resume') {
    // Profile Photo
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const allowedExts = ['.jpg', '.jpeg', '.png', '.webp'];
    const hasAllowedExt = allowedExts.some(ext => filename.endsWith(ext));
    const hasAllowedMime = allowedMimeTypes.includes(file.mimetype);
    
    if (hasAllowedMime || hasAllowedExt) {
      cb(null, true);
    } else {
      console.error(`[UPLOAD REJECTED] Profile Photo invalid type: ${file.originalname} (${file.mimetype})`);
      cb(new Error('Invalid file type: Profile Photo must be JPG, JPEG, PNG, or WEBP'), false);
    }
  } else if (file.fieldname === 'certificate') {
    // Educational Certificate
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    const allowedExts = ['.jpg', '.jpeg', '.png', '.pdf'];
    const hasAllowedExt = allowedExts.some(ext => filename.endsWith(ext));
    const hasAllowedMime = allowedMimeTypes.includes(file.mimetype);
    
    if (hasAllowedMime || hasAllowedExt) {
      cb(null, true);
    } else {
      console.error(`[UPLOAD REJECTED] Certificate invalid type: ${file.originalname} (${file.mimetype})`);
      cb(new Error('Invalid file type: Educational Certificate must be PDF, JPG, JPEG, or PNG'), false);
    }
  } else {
    cb(null, true);
  }
};

const upload = multer({ 
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB size limit
  fileFilter
});

const getFileUrl = (file) => {
  if (!file) return null;
  return file.path;
};

module.exports = {
  upload,
  getFileUrl
};

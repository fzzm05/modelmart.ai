import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to create a unique upload directory based on user ID
const createUploadDir = (req, file) => {
    const userId = req.session ? req.session.userId : null; // Ensure userId is defined
    const modelName = req.body.modelName; // Get the model name from the request body

    if (!userId) {
        throw new Error('User not authenticated');
    }
    if (!modelName) {
        throw new Error('Model name is required');
    }

    const userDir = path.join(__dirname, '../uploads', `${userId}-${modelName}`); // Use the model name in the directory
    // Create the directory if it doesn't exist
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true });
    }
    return userDir; // Return the directory path
};

// Set up Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        try {
            const uploadDir = createUploadDir(req, file); // Get the upload directory
            cb(null, uploadDir); // Pass the directory to the callback
        } catch (error) {
            cb(error, null); // Pass the error to the callback
        }
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

// File filter to only allow model.pkl, app.py, and requirements.txt files
const fileFilter = (req, file, cb) => {
    if (file.fieldname === 'model' && !file.originalname.endsWith('.pkl')) {
        return cb(new Error('Only .pkl files are allowed for the model'), false);
    }
    if (file.fieldname === 'app' && !file.originalname.endsWith('.py')) {
        return cb(new Error('Only .py files are allowed for the app'), false);
    }
    if (file.fieldname === 'requirements' && !file.originalname.endsWith('.txt')) {
        return cb(new Error('Only .txt files are allowed for requirements'), false);
    }
    if (file.fieldname === 'readme' && !file.originalname.endsWith('.md')) {
        return cb(new Error('Only .md files are allowed for readme'), false);
    }
    cb(null, true); // Accept the file
};

// Create the multer upload instance
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter
}).fields([
    { name: 'model', maxCount: 1 },
    { name: 'app', maxCount: 1 },
    { name: 'requirements', maxCount: 1 }, // Add requirements field
    { name: 'readme', maxCount: 1 } // Add readme field
]);

export default upload;

import { Router } from 'express';
import upload from './uploadRoutes.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
const router = Router();

// Serve the dashboard page
router.get('/', isAuthenticated, (req, res) => {
    res.render('dashboard');
});

// Handle file upload
router.post('/upload', isAuthenticated, upload, (req, res) => {
    // Handle the uploaded files
    if (!req.files.model || !req.files.app) {
        return res.status(400).send('Both files are required.');
    }
    // Process the files...
    res.send('Files uploaded successfully!');
});

router.get('/uploadmodel',isAuthenticated, (req, res) => {
    res.render('upload-model');
});

export default router;

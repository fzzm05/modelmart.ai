import { Router } from 'express';
import upload from './uploadRoutes.js';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import db from '../db.js';
const router = Router();

// Serve the dashboard page
router.get('/', isAuthenticated, (req, res) => {
    res.render('dashboard');
});

// Handle file upload
router.post('/upload', isAuthenticated, upload, async (req, res) => {
    console.log(req.files);
    // Handle the uploaded files
    if (!req.files.model || !req.files.app) {
        return res.status(400).json({ error: 'Both model and app files are required.' });
    }
    
    // Check if README.md is uploaded
    if (!req.files.readme) {
        return res.status(400).json({ error: 'README.md file is required.' });
    }

    const modelName = req.body.modelName;
    const description = req.body.description;

    if (!modelName) {
        return res.status(400).json({ error: 'Model name is required.' });
    }

    try {
        // Save model information to database
        await db.query(
            'INSERT INTO user_models (user_id, model_name, description) VALUES ($1, $2, $3)',
            [req.session.userId, modelName, description]
        );
        
        res.json({ 
            message: 'Files uploaded successfully and model registered!',
            modelName,
            description
        });
    } catch (error) {
        console.error('Error saving model info:', error);
        res.status(500).json({ error: 'Failed to save model information' });
    }
});

router.get('/uploadmodel',isAuthenticated, (req, res) => {
    res.render('upload-model');
});

export default router;

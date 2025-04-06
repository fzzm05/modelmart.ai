import { Router } from 'express';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import db from '../db.js';

const router = Router();

// Serve the model detail page
router.get('/', isAuthenticated, (req, res) => {
    // The model ID will be passed as a query parameter and handled by frontend JavaScript
    res.render('model-detail');
});

// Serve the model upload page (redirecting from /model/upload to /dashboard/uploadmodel)
router.get('/upload', isAuthenticated, (req, res) => {
    res.redirect('/dashboard/uploadmodel');
});

export default router; 
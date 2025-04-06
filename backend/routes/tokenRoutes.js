import { Router } from 'express';
import { isAuthenticated } from '../middleware/authMiddleware.js';
import db from '../db.js';
import { 
    getUserTokenBalance, 
    addTokens, 
    deductTokens,
    canAccessModel
} from '../services/tokenService.js';

const router = Router();

// Serve the token management page
router.get('/', isAuthenticated, (req, res) => {
    res.render('tokens');
});

// Get user's token balance
router.get('/balance', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        const balance = await getUserTokenBalance(userId);
        res.json({ balance });
    } catch (error) {
        console.error('Error fetching token balance:', error);
        res.status(500).json({ error: 'Failed to fetch token balance' });
    }
});

// Purchase tokens
router.post('/purchase', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        const { amount } = req.body;
        
        if (!amount || amount <= 0) {
            return res.status(400).json({ error: 'Invalid token amount' });
        }
        
        // In a real application, you would integrate with a payment gateway here
        // For now, we'll just add the tokens directly
        const newBalance = await addTokens(userId, parseInt(amount));
        
        res.json({ 
            success: true, 
            message: `Successfully purchased ${amount} tokens`,
            newBalance 
        });
    } catch (error) {
        console.error('Error purchasing tokens:', error);
        res.status(500).json({ error: 'Failed to purchase tokens' });
    }
});

// Check if user can access a model
router.get('/can-access/:modelId', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        const modelId = req.params.modelId;
        
        const canAccess = await canAccessModel(userId, modelId);
        
        res.json({ canAccess });
    } catch (error) {
        console.error('Error checking model access:', error);
        res.status(500).json({ error: 'Failed to check model access' });
    }
});

// View transaction history
router.get('/transactions', isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        
        const result = await db.query(
            `SELECT t.*, m.name as model_name 
             FROM token_transactions t
             LEFT JOIN models m ON t.model_id = m.id
             WHERE t.user_id = $1
             ORDER BY t.created_at DESC`,
            [userId]
        );
        
        res.json({ transactions: result.rows });
    } catch (error) {
        console.error('Error fetching transaction history:', error);
        res.status(500).json({ error: 'Failed to fetch transaction history' });
    }
});

export default router; 
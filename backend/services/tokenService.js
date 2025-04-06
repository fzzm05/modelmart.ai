import db from '../db.js';

/**
 * Get a user's current token balance
 * @param {number} userId - The user's ID
 * @returns {Promise<number>} - The user's token balance
 */
export const getUserTokenBalance = async (userId) => {
    try {
        const result = await db.query(
            'SELECT token_balance FROM users WHERE id = $1',
            [userId]
        );
        
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        
        return result.rows[0].token_balance;
    } catch (error) {
        console.error('Error getting user token balance:', error);
        throw error;
    }
};

/**
 * Add tokens to a user's balance
 * @param {number} userId - The user's ID
 * @param {number} amount - The amount of tokens to add
 * @returns {Promise<number>} - The new token balance
 */
export const addTokens = async (userId, amount) => {
    try {
        const result = await db.query(
            'UPDATE users SET token_balance = token_balance + $1 WHERE id = $2 RETURNING token_balance',
            [amount, userId]
        );
        
        if (result.rows.length === 0) {
            throw new Error('User not found');
        }
        
        // Log the transaction
        await logTokenTransaction(userId, null, amount, 'purchase');
        
        return result.rows[0].token_balance;
    } catch (error) {
        console.error('Error adding tokens:', error);
        throw error;
    }
};

/**
 * Deduct tokens from a user's balance
 * @param {number} userId - The user's ID
 * @param {number} amount - The amount of tokens to deduct
 * @param {number} modelId - The model ID (if applicable)
 * @returns {Promise<boolean>} - Whether the deduction was successful
 */
export const deductTokens = async (userId, amount, modelId = null) => {
    try {
        // First check if user has sufficient tokens
        const balanceResult = await db.query(
            'SELECT token_balance FROM users WHERE id = $1',
            [userId]
        );
        
        if (balanceResult.rows.length === 0) {
            throw new Error('User not found');
        }
        
        const currentBalance = balanceResult.rows[0].token_balance;
        
        if (currentBalance < amount) {
            return false; // Insufficient tokens
        }
        
        // Update the balance
        const updateResult = await db.query(
            'UPDATE users SET token_balance = token_balance - $1 WHERE id = $2 RETURNING token_balance',
            [amount, userId]
        );
        
        // Log the transaction
        await logTokenTransaction(userId, modelId, amount, 'usage');
        
        return true;
    } catch (error) {
        console.error('Error deducting tokens:', error);
        throw error;
    }
};

/**
 * Log a token transaction
 * @param {number} userId - The user's ID
 * @param {number|null} modelId - The model ID (if applicable)
 * @param {number} tokensSpent - The number of tokens involved
 * @param {string} transactionType - The type of transaction
 * @returns {Promise<void>}
 */
export const logTokenTransaction = async (userId, modelId, tokensSpent, transactionType) => {
    try {
        await db.query(
            'INSERT INTO token_transactions (user_id, model_id, tokens_spent, transaction_type) VALUES ($1, $2, $3, $4)',
            [userId, modelId, tokensSpent, transactionType]
        );
    } catch (error) {
        console.error('Error logging token transaction:', error);
        throw error;
    }
};

/**
 * Check if a user can access a model
 * @param {number} userId - The user's ID
 * @param {number} modelId - The model ID
 * @returns {Promise<boolean>} - Whether the user can access the model
 */
export const canAccessModel = async (userId, modelId) => {
    try {
        // Get model details
        const modelResult = await db.query(
            'SELECT price_per_use, free_trial_available FROM models WHERE id = $1',
            [modelId]
        );
        
        if (modelResult.rows.length === 0) {
            throw new Error('Model not found');
        }
        
        const model = modelResult.rows[0];
        
        // Check if free trial is available
        if (model.free_trial_available) {
            return true;
        }
        
        // Check if user has enough tokens
        return await deductTokens(userId, model.price_per_use, modelId);
    } catch (error) {
        console.error('Error checking model access:', error);
        throw error;
    }
}; 
import { Router } from "express";
import db from "../db.js";
import bcrypt from "bcryptjs";
const router = Router();

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/signup", (req, res) => {
    res.render("signup");
});

router.get("/forgot-password", (req, res) => {
    res.render("forgot-password");
});

router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password);
    
    try {
        const result = await db.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        
        // Set user session
        req.session.userId = user.id;
        req.session.email = user.email;

        req.session.save(() => {
            res.redirect('/dashboard');
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post("/signup", async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Check if user exists
        const existingUser = await db.query(
            'SELECT email FROM users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered, please go back and login' });
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await db.query(
            'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
            [email, hashedPassword]
        );

        // Add initial 1000 tokens for new user
        await db.query(
            'UPDATE users SET token_balance = $1 WHERE email = $2',
            [100, email]
        );

        // Initialize session
        req.session.userId = newUser.rows[0].id;
        req.session.email = newUser.rows[0].email;

        // Save session and redirect
        req.session.save((err) => {
            if (err) {
                console.error('Session save error:', err);
                return res.status(500).json({ error: 'Error creating session' });
            }
            res.redirect('/dashboard');
        });

    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Failed to create account' });
    }
});

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    console.log(email); 
});

router.post("/logout", (req, res) => {
    req.session.destroy();
    res.redirect('/auth/login');
});

export default router;
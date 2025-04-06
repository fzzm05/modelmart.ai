import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { Router } from "express";
import { isAuthenticated } from '../middleware/authMiddleware.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

// Routes
router.get('/', isAuthenticated, (req, res) => {
    res.render('index');
});

router.post('/run', isAuthenticated, (req, res) => {
    const inputData = req.body.input; 
    console.log(inputData);
    // Expecting: { "input": { "IQ":128, "CGPA":8, "10th_Marks":89, "12th_Marks":76, "Communication_Skills":8 } }

    const pythonScriptPath = path.join(__dirname, '.', 'uploads', `${req.session.userId}-${projectName}`, 'app.py');
    const python = spawn('python3', [pythonScriptPath, JSON.stringify(inputData)]);

    let result = '';

    python.stdout.on('data', (data) => {
        result += data.toString();
    });

    python.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    python.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).send('Python script failed');
        }
        res.json({ prediction: JSON.parse(result) });
    });
});

export default router;

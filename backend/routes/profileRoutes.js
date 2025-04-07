import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import db from "../db.js";

const router = Router();

router.get("/", isAuthenticated, async (req, res) => {
    try {
        const userId = req.session.userId;
        const models = await db.query("SELECT * FROM user_models WHERE user_id = $1", [userId]);
        
        res.render("profile", { 
            models: models.rows,
            hasModels: models.rows.length > 0
        });
    } catch (error) {
        console.error("Error fetching user models:", error);
        res.render("profile", { 
            models: [],
            hasModels: false,
            error: "Failed to fetch models"
        });
    }
});

export default router;
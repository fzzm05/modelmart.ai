import express from "express";
import { Router } from "express";
import { isAuthenticated } from "../middleware/authMiddleware.js";
const router = Router();

router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/profile", isAuthenticated, (req, res) => {
    res.render("profile");
});

export default router;
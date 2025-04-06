import { pool } from "../db.js";

export const isAuthenticated = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/auth/login');
    }
    next();
};
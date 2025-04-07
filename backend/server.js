import express from "express";
import session from "express-session";
import env from "dotenv";
import bodyParser from "body-parser";
import path from "path";
import { fileURLToPath } from "url";

import homeRoutes from "./routes/homeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import tokenRoutes from "./routes/tokenRoutes.js";
import modelRoutes from "./routes/modelRoutes.js"; 
import modelPageRoutes from "./routes/modelPageRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

const app = express();
const port = process.env.PORT || 4000;
env.config();

// Initialize express-session
app.use(session({
    secret: process.env.SESSION_SECRET_KEY, // Replace with a strong, random string
    resave: false, // Prevents session from being saved repeatedly when unmodified
    saveUninitialized: false, // Avoids storing empty sessions
    cookie: {
        secure: false, // Set to `true` if using HTTPS
        httpOnly: true, // Prevents client-side JavaScript access
        maxAge: 7 * 24 * 60 * 60 * 1000 // Session expires in 7 days
    }
}));

// Create __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set the view engine and views folder
app.set("view engine", "ejs");
// Point to the views folder in the frontend directory
app.set("views", path.join(__dirname, "../frontend/views/pages")); 

// Serve static files from the frontend folder
app.use(express.static(path.join(__dirname, "../frontend/public")));

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", homeRoutes);
app.use("/auth", authRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/tokens", tokenRoutes);
app.use("/model", modelRoutes);
app.use("/models", modelPageRoutes);
app.use("/profile", profileRoutes);

app.listen(port, () => {
    console.log(`Server running on port http://localhost:${port}`);
});


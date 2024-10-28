const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const port = 8854;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/gameman", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Connected to MongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});

// Define a User schema and model
const userSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    mobile: String
});
const User = mongoose.model("User", userSchema);

// Middleware for parsing JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (CSS, JS) directly from the gameman directory
app.use(express.static(path.join(__dirname, "gameman")));

// Routes
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "gameman", "header.html"));
});

// Registration route
app.post("/submit-registration", async (req, res) => {
    const { firstName, lastName, email, password, mobile } = req.body;

    try {
        // Check if the email is already registered
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "User already registered. Please login." });
        } else {
            // Register the user
            const newUser = new User({ firstName, lastName, email, password, mobile });
            await newUser.save();
            console.log("User registered:", newUser);
            return res.status(200).json({ message: "Registration successful." });
        }
    } catch (error) {
        console.error("Error saving user data:", error);
        res.status(500).json({ message: "Error saving user data." });
    }
});

// Sign In route
app.post("/signin", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });
        
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Check password (you might want to hash passwords in a real application)
        if (user.password !== password) {
            return res.status(401).json({ message: "Invalid email or password." });
        }

        // Successful sign-in
        console.log("User signed in:", user);
        return res.status(200).json({ message: "Sign-in successful.", redirectUrl: "html.html" });
    } catch (error) {
        console.error("Error during sign-in:", error);
        return res.status(500).json({ message: "Error during sign-in." });
    }
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).send("Page not found");
});

// Start the server
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});

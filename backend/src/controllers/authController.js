import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User.js'; 

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields required" });

        const user = await User.findOne({ email });
        
        // 1. Check if user exists & password matches
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        if (user.status === 'inactive') return res.status(403).json({ message: "Account deactivated" });

        // --- FIX STARTS HERE ---
        // 2. Update the lastLogin field to the current time
        user.lastLogin = new Date();
        await user.save(); 
        // --- FIX ENDS HERE ---

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({
            message: "Login successful",
            token,
            user: { 
                id: user._id, 
                fullName: user.fullName || user.name || "", 
                email: user.email, 
                role: user.role,
                lastLogin: user.lastLogin // <--- Send it to frontend if needed
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const signup = async (req, res) => {
    try {
        // Changed 'fullName' to 'name' to match your User Model schema
        const { fullName, email, password } = req.body;
        
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Full Name, Email and Password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        
        // create new user
        const newUser = new User({ 
            fullName, // Make sure this matches frontend (name) and Schema (name)
            email, 
            password: hashedPassword 
        });
        
        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email
            }
        });

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export { login, signup };
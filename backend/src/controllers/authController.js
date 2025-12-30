import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User.js'; 

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ message: "All fields required" });

        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        
        if (user.status === 'inactive') return res.status(403).json({ message: "Account deactivated" });

        user.lastLogin = new Date();
        await user.save(); 

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

        res.json({
            message: "Login successful",
            token,
            user: { 
                id: user._id, 
                fullName: user.fullName || user.name || "", 
                email: user.email, 
                role: user.role,
                lastLogin: user.lastLogin
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "Full Name, Email and Password are required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = new User({ 
            fullName, 
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
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../model/User.js";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.status === "inactive")
      return res.status(403).json({ message: "Account deactivated" });

    user.lastLogin = new Date();
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName || user.name || "",
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const signup = async (req, res) => {
  try {
    console.log("1. Signup Request Received:", req.body);

    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      console.log("Fail: Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const strongPasswordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;

    if (!strongPasswordRegex.test(password)) {
      console.log("Fail: Weak Password");
      return res.status(400).json({
        message:
          "Password must be 8+ chars and include a number & special char (!@#$%^&*)",
      });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log("Fail: User already exists");
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const isAdmin = email.toLowerCase() === "ashutosh.dwivedi604@gmail.com";

    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: isAdmin ? "admin" : "user",
    });

    if (user) {
      console.log("Success: User created");
      res.status(201).json({
        _id: user.id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Signup Error:", error);
    res.status(500).json({ message: error.message });
  }
};

export { login, signup };

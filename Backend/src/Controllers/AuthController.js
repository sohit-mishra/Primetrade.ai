const User = require('@/Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('@/Config/env');
const redisClient = require("@/Config/redisClient");
const Blacklist = require('@/Models/Blacklist');

const Register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" })
    }
}


const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ userId: user._id }, config.JWT_SECRET, { expiresIn: "1h" })

        res.status(200).json({ token, message: "Login successful" , user : 
           {id : user._id, name : user.name, email: user.email}
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

const logout = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return res.status(400).json({ message: "Invalid token" });
    }

    const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
    if (expiresIn <= 0) {
      return res.status(400).json({ message: "Token already expired" });
    }

    await redisClient.set(`blacklist:${token}`, "true", { EX: expiresIn });
    await Blacklist.create({ token, expiresAt: new Date(decoded.exp * 1000) });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ message: "Server Error" });
  }
};

const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const cachedUser = await redisClient.get(`user:${userId}`);

        if (cachedUser) {
            return res.status(200).json({ user: JSON.parse(cachedUser), fromCache: true });
        }

        const user = await User.findById(userId).select('-password');
        await redisClient.set(`user:${userId}`, JSON.stringify(user), { EX: 3600 });

        res.status(200).json({ user });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, email } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email },
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    await redisClient.set(
      `user:${userId}`,
      JSON.stringify(updatedUser),
      { EX: 3600 }
    );

    res.status(200).json({
      user: updatedUser,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


const changePassword = async (req, res) => {
    try {
        const userId = req.user.userId;

        const { oldPassword, newPassword } = req.body;

        const user = await User.findById(userId);

        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Old password is incorrect" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
        res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
}

module.exports = {
    Register,
    login,
    updateProfile,
    getProfile,
    changePassword,
    logout
}
import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { upsertStreamUser } from "../lib/stream.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters" });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "Email already exist, Please provide different email",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    const newUser = await User.create({
      email,
      fullName,
      password: hashedPassword,
      profilePic: randomAvatar,
    });

    //Upsert User in Stream :TODO
    try {
      await upsertStreamUser({
        id: newUser._id.toString(),
        name: newUser.fullName,
        image: newUser.profilePic || "",
      });
      console.log(`Stream user created for ${newUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error.message);
    }

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(201).json({ message: "User created successfully", newUser });
  } catch (error) {
    res.status(500).json({ message: "User failed to create", error });
    console.log(error);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email" });
    }

    const isPassMatched = await bcrypt.compare(password, user.password);

    if (!isPassMatched) {
      return res
        .status(400)
        .json({ message: "Invalid Password, Please enter valid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({ message: "Logged in successfully" });
  } catch (error) {
    res.status(500).json({ message: "User failed to login", error });
    console.log(error);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successfully" });
};

export const onboard = async (req, res) => {
  try {
    const userId = req.user._id;

    const { fullName, bio, nativeLanguage, learningLanguage, location } =
      req.body;

    if (
      !fullName ||
      !bio ||
      !nativeLanguage ||
      !learningLanguage ||
      !location
    ) {
      return res.status(400).json({
        message: "All fields are required",
        missing: [
          !fullName && "fullName",
          !bio && "bio",
          !nativeLanguage && "nativeLanguage",
          !learningLanguage && "learningLanguage",
          !location && "location",
        ].filter(Boolean),
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        ...req.body,
        isOnboarded: true,
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    //Update User in Stream :TODO
    try {
      await upsertStreamUser({
        id: updatedUser._id.toString(),
        name: updatedUser.fullName,
        image: updatedUser.profilePic || "",
      });
      console.log(`Stream user created for ${updatedUser.fullName}`);
    } catch (error) {
      console.log("Error creating Stream user:", error.message);
    }

    res
      .status(200)
      .json({ message: "updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Onboard failed", error });
    console.log(error);
  }
};

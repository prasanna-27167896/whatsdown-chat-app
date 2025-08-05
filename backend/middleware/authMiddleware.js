import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req?.cookies?.token;

    if (!token) {
      res.status(400).json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      res.status(400).json({ message: "Unauthorized - Invalid token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(400).json({ message: "Unauthorized - User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware", error);
    res.status(500).json({ message: "internal Server Error" });
  }
};

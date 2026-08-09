import dotenv from "dotenv";
import User from "../models/users.js";
import jwt from "jsonwebtoken";

dotenv.config();

const getAuthenticatedUser = async (req) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return null;
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded._id });
    if (!user) {
      return null;
    }
    return user;
  } catch (err) {
    return null;
  }
};

export default getAuthenticatedUser;

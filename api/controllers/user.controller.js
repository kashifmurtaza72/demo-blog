import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcryptjs from "bcryptjs";

export const test = (req, res) => {
  res.json({
    message: "API is working now...",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "you are not allowed to update this uer"));
  }

  if (req.body.email) {
    if (!req.body.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return next(errorHandler(403, "Invalid email format"));
    }
  }

  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(403, "Password must be at least 6 characters"));
    }
    req.body.password = bcryptjs.hashSync(req.body.password);
  }

  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(403, "Username must be between 7 and 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(403, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(403, "Username must be lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(403, "Username can only contain alphanumeric characters")
      );
    }
  }

  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updateUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

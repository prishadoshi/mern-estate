import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10); //10- saltnumber
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save(); //save in database
    res.status(201).json("User Created successfully"); //201 status which means something is created
  } catch (error) {
    next(error);
  }
};

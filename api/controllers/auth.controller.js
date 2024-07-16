import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  //use next to use the middleware defined in index.js
  const { username, email, password } = req.body;
  const hashedPassword = bcryptjs.hashSync(password, 10); //10- saltnumber
  const newUser = new User({ username, email, password: hashedPassword }); //usermodel
  try {
    await newUser.save(); //save in database
    res.status(201).json("User Created successfully"); //201 status which means something is created
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found!"));
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) return next(errorHandler(401, "Wrong credentials!"));

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const { password: pass, ...rest } = validUser._doc; //return all except password

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error); //handle error using the middleware
  }
};

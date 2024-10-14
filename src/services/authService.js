import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config";

/*##################
####### REGISTER ###
###################*/
const register = (username, email, password, rePass) => {
  if (password !== rePass) {
    throw new Error("Password is not the same!");
  }
  return User.create({ username, email, password });
};

/*##################
####### LOGIN ###
###################*/

const login = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Email or password don't match!");
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    throw new Error("Email or password don't match!");
  }
  const payload = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };

  const token = jwt.sign(payload, process.env.SECRET, { expiresIn: "6h" });

  return token;
};

/*##################
####### LOGOUT ###
###################*/

export default {
  register,
  login,
};

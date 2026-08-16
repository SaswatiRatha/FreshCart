import User from "../models/users.js";

export const registerUserInput = async (input) => {
  const { name, password } = input;
  const email = input.email.toLowerCase().trim();
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists. Please login!");
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return user;
};

export const loginUserInput = async (input, res) => {
  const { password } = input;
  const email = input.email.toLowerCase().trim();
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password!");
  }

  const isPasswordValid = await user.validatePassword(password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password!");
  }

  const token = await user.getJWT();
  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
  });
  return user;
};

export const logout = async (res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
  });
  return true;
};

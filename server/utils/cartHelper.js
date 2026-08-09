import Cart from "../models/cart.js";

export const requireUser = (user) => {
  if (!user) {
    throw new Error("Authentication required");
  }

  return user;
};

export const getUserCart = async (user) => {
  requireUser(user);

  return await Cart.findOne({
    user: user._id,
  });
};

export const getPopulatedCart = async (cart) => {
  if (!cart) {
    return null;
  }

  await cart.populate("items.product");

  return cart;
};

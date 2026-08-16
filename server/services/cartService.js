import Cart from "../models/cart.js";
import Product from "../models/products.js";
import { getUserCart } from "../utils/cartHelper.js";

export const addProductToCart = async (user, input) => {
  if (!user) {
    throw new Error("Please login!");
  }

  const { productId, quantity } = input;

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (product.stock < quantity) {
    throw new Error("Not enough stock");
  }

  let cart = await Cart.findOne({
    user: user._id,
  });

  if (!cart) {
    cart = await Cart.create({
      user: user._id,
      items: [
        {
          product: productId,
          quantity,
        },
      ],
    });
  } else {
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId,
    );

    if (existingItem) {
      const newQuantity = existingItem.quantity + quantity;

      if (newQuantity > product.stock) {
        throw new Error("Not enough stock");
      }
      existingItem.quantity = newQuantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
      });
    }
    await cart.save();
  }
  await cart.populate("items.product");
  return cart;
};

export const updateCartItem = async (user, input) => {
  const { productId, quantity } = input;

  if (quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const cart = await getUserCart(user);

  if (!cart) {
    throw new Error("Cart not found");
  }

  const cartItem = cart.items.find(
    (item) => item.product.toString() === productId,
  );

  if (!cartItem) {
    throw new Error("Product is not in the cart");
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  if (quantity > product.stock) {
    throw new Error("Not enough stock");
  }

  cartItem.quantity = quantity;

  await cart.save();
  await cart.populate("items.product");

  return cart;
};

export const removeCartItem = async (user, productId) => {
  const cart = await getUserCart(user);

  if (!cart) {
    throw new Error("Cart not found");
  }

  const itemExists = cart.items.some(
    (item) => item.product.toString() === productId,
  );

  if (!itemExists) {
    throw new Error("Product is not in the cart");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  await cart.save();

  await cart.populate("items.product");
  return cart;
};

export const clearUserCart = async (user) => {
  const cart = await getUserCart(user);

  if (!cart) {
    throw new Error("Cart not found");
  }

  cart.items = [];

  await cart.save();

  await cart.populate("items.product");

  return cart;
};

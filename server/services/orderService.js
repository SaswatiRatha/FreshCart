import Product from "../models/products.js";
import Order from "../models/order.js";
import { getPopulatedCart, getUserCart } from "../utils/cartHelper.js";
import User from "../models/users.js";

export const createOrderFunction = async (user) => {
  const cart = await getUserCart(user);

  if (!cart || cart.items.length === 0) {
    throw new Error("Cart is empty");
  }

  await getPopulatedCart(cart);

  for (const item of cart.items) {
    if (item.quantity > item.product.stock) {
      throw new Error(`Not enough stock for ${item.product.name}`);
    }
  }

  const orderItems = cart.items.map((item) => ({
    product: item.product._id,
    quantity: item.quantity,
    price: item.product.price,
  }));

  const totalAmount = cart.items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0,
  );

  const order = await Order.create({
    user: user._id,
    items: orderItems,
    totalAmount,
  });

  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, {
      $inc: {
        stock: -item.quantity,
      },
    });
  }

  cart.items = [];
  await cart.save();

  await order.populate("items.product");

  return order;
};

export const ordersFunction = async (user) => {
  if (!user) {
    throw new Error("Please login!");
  }

  const orders = await Order.find({
    user: user._id,
  })
    .populate("items.product")
    .sort({ createdAt: -1 });

  return orders;
};

export const orderFunction = async (id, user) => {
  if (!user) {
    throw new Error("Please login!");
  }

  const order = await Order.findOne({
    _id: id,
    user: user._id,
  })
    .populate("user")
    .populate("items.product")
    .sort({ createdAt: -1 });

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

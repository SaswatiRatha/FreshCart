import Product from "../models/products.js";
import User from "../models/users.js";
import Cart from "../models/cart.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getPopulatedCart, getUserCart } from "../utils/cartHelper.js";
import {
  addProductToCart,
  clearUserCart,
  removeCartItem,
  updateCartItem,
} from "../services/cartService.js";
import {
  loginUserInput,
  logout,
  registerUserInput,
} from "../services/userService.js";
import { create, deleteProduct, update } from "../services/productService.js";
import {
  createOrderFunction,
  orderFunction,
  ordersFunction,
} from "../services/orderService.js";

const resolvers = {
  Query: {
    products: async () => {
      return await Product.find();
    },

    product: async (_, { id }) => {
      return await Product.findById(id);
    },

    users: async () => {
      return await User.find();
    },

    user: async (_, { id }) => {
      return await User.findById(id);
    },

    currentUser: async (_, __, { user }) => {
      if (!user) {
        throw new Error("Authentication required");
      }
      return user;
    },

    myCart: async (_, __, { user }) => {
      const cart = await getUserCart(user);
      return getPopulatedCart(cart);
    },

    orders: async (_, __, { user }) => {
      return ordersFunction(user);
    },

    order: async (_, { id }, { user }) => {
      return orderFunction(id, user);
    },
  },
  Mutation: {
    createProduct: async (_, { input }, { user }) => {
      return create(input, user);
    },

    updateProduct: async (_, { id, input }, { user }) => {
      return update(id, input, user);
    },

    deleteProduct: async (_, { id }, { user }) => {
      return deleteProduct(id, user);
    },

    registerUser: async (_, { input }) => {
      return registerUserInput(input);
    },

    loginUser: async (_, { input }, { res }) => {
      return loginUserInput(input, res);
    },

    logoutUser: async (_, __, { res }) => {
      return logout(res);
    },

    addToCart: async (_, { input }, { user }) => {
      return addProductToCart(user, input);
    },

    updateCartItem: async (_, { input }, { user }) => {
      return updateCartItem(user, input);
    },

    removeFromCart: async (_, { productId }, { user }) => {
      return removeCartItem(user, productId);
    },

    clearCart: async (_, __, { user }) => {
      return clearUserCart(user);
    },

    createOrder: async (_, __, { user }) => {
      return createOrderFunction(user);
    },
  },

  User: {
    id: (user) => user._id.toString(),
  },

  Cart: {
    totalItems: (cart) => {
      return cart.items.reduce((total, item) => total + item.quantity, 0);
    },
    subtotal: (cart) => {
      return cart.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
      );
    },
  },

  Order: {
    createdAt: (order) => {
      return new Date(order.createdAt).toISOString();
    },
  },
};

export default resolvers;

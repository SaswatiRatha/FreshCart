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
  },
  Mutation: {
    createProduct: async (_, { input }) => {
      const product = await Product.create(input);
      return product;
    },

    updateProduct: async (_, { id, input }) => {
      const product = await Product.findByIdAndUpdate(id, input, {
        new: true,
        runValidators: true,
      });
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    },

    deleteProduct: async (_, { id }) => {
      const product = await Product.findByIdAndDelete(id);
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    },

    registerUser: async (_, { input }) => {
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
    },

    loginUser: async (_, { input }, { res }) => {
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
    },

    logoutUser: async (_, __, { res }) => {
      res.clearCookie("token", {
        httpOnly: true,
        sameSite: "lax",
      });
      return true;
    },

    addToCart: async (_, { input }, { user }) => {
      return addProductToCart(user, input);
    },

    updateCartItem: async (_, { input }, { user }) => {
      updateCartItem(user, input);
    },

    removeFromCart: async (_, { productId }, { user }) => {
      removeCartItem(user, productId);
    },

    clearCart: async (_, __, { user }) => {
      clearUserCart(user);
    },
  },
};

export default resolvers;

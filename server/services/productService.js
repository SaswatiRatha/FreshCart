import Product from "../models/products.js";

export const create = async (input, user) => {
  if (!user) {
    throw new Error("Authentication required");
  }
  const product = await Product.create(input);
  return product;
};

export const update = async (id, input, user) => {
  if (!user) {
    throw new Error("Authentication required");
  }
  const product = await Product.findByIdAndUpdate(id, input, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

export const deleteProduct = async (id, user) => {
  if (!user) {
    throw new Error("Authentication required");
  }
  const product = await Product.findByIdAndDelete(id);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

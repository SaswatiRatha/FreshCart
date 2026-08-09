import mongoose from "mongoose";

const { Schema } = mongoose;

const productSchema = new Schema({
  name: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
  },
  category: {
    type: String,
  },
  image: {
    type: String,
  },
  stock: {
    type: Number,
  },
});

const Product = mongoose.model("Product", productSchema);
export default Product;

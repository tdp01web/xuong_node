import mongoose, { Schema } from "mongoose";
const ctegorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      defaultValue: "Uncategorized",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      defaultValue: "Uncategorized",
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
export const Category = mongoose.model("Category", ctegorySchema);

import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Website", "SaaS Application", "AI"],
      required: true,
    },
    pages: {
      type: String,
      trim: true,
    },
    timeline: {
      type: String,
      trim: true,
    },
    revision: {
      type: String,
      trim: true,
    },
    price: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      trim: true,
    }
  },
  { timestamps: true }
);

const Package = mongoose.model("Package", packageSchema);

export default Package;
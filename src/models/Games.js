import { Schema, model, Types } from "mongoose";

const gameSchema = new Schema({
  platform: {
    type: String,
    required: [true, "Platform is required"],
    enum: ["PC", "Nintendo", "PS4", "PS5", "XBOX"],
  },
  name: {
    type: String,
    required: [true, "Name is required!"],
  },
  image: {
    type: String,
    required: [true, "Image url is required!"],
  },
  price: {
    type: Number,
    required: [true, "Price is required!"],
  },
  genre: {
    type: String,
    required: [true, "Genre is required!"],
  },

  description: {
    type: String,
  },
  owner: {
    type: Types.ObjectId,
    ref: "User",
  },
  boughtBy: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
});

const Game = model("Game", gameSchema);

export default Game;

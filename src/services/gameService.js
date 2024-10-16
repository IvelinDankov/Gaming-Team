import Game from "../models/Games.js";

const create = (gameData, ownerId) => {
  return Game.create({ ...gameData, owner: ownerId });
};

const getAll = () => {
  return Game.find();
};

export default {
  create,
  getAll,
};

import Game from "../models/Games.js";

const create = (gameData, ownerId) => {
  return Game.create({ ...gameData, owner: ownerId });
};

const getAll = (filter={}) => {
  const query = Game.find();

  if (filter.search) {
    query.find({name: {$regex: filter.search, $options: 'i'}})
  }


  if (filter.platform) {
    query.find({platform : filter.platform})
  }

  return query
};

const getOne = (gameId) => {
  return Game.findById(gameId);
};

const edit = (gameId, gameData) => {
  return Game.findByIdAndUpdate(gameId, gameData);
};

const remove = (gameId) => {
  return Game.findByIdAndDelete(gameId);
};

const buy = (gameId, userId) => {
  return Game.findByIdAndUpdate(gameId, { $push: { boughtBy: userId } });
};

export default {
  create,
  getAll,
  getOne,
  edit,
  remove,
  buy,
};

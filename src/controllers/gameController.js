import { Router } from "express";
import { getErrorMsg } from "../utils/getErrorMsg.js";
import gameService from "../services/gameService.js";
import { isAuth } from "../middlewares/authMiddleware.js";

const router = Router();

/*##################
####### CREATE ###
###################*/

router.get("/create", isAuth, (req, res) => {
  const gamePlatform = getPlatformType({});
  res.render("games/create", {
    title: "Create Page - Gaming Team",
    platform: gamePlatform,
  });
});

router.post("/create", isAuth, async (req, res) => {
  const gameData = req.body;
  const ownerId = req.user._id;

  try {
    await gameService.create(gameData, ownerId);
    res.redirect("/games/catalog");
  } catch (err) {
    const error = getErrorMsg(err);
    const gamePlatform = getPlatformType(gameData);
    res.render("games/create", {
      title: "Create Page",
      game: gameData,
      platform: gamePlatform,
      error,
    });
  }
});

/*##################
####### CATALOG ###
###################*/

router.get("/catalog", async (req, res) => {
  const games = await gameService.getAll().lean();

  res.render("games/catalog", { games });
});

/*##################
####### DETAILS ###
###################*/

router.get("/:gameId/details", async (req, res) => {
  const gameId = req.params.gameId;
  const game = await gameService.getOne(gameId).lean();
  // const userId = req.user._id;

  const isOwner = req.user?._id == game.owner;

  const bought = game.boughtBy.some((userId) => userId == req.user?._id);

  res.render(`games/details`, { title: "Details Page", game, isOwner, bought });
});

/*##################
####### EDIT ###
###################*/

router.get("/:gameId/edit", isAuth, async (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.user._id;
  const gameData = req.body;

  const isOwner = isGameOwner(gameId, userId);

  if (!isOwner) {
    res.redirect("404");
  }

  const gamePlatform = getPlatformType({});
  const game = await gameService.getOne(gameId).lean();
  res.render("games/edit", { game, platform: gamePlatform });
});

router.post("/:gameId/edit", isAuth, async (req, res) => {
  const gameId = req.params.gameId;
  const gameData = req.body;

  const isOwner = game.owner.toString() == req.user._id;

  if (!isOwner) {
    return res.redirect("/404");
  }

  try {
    await gameService.edit(gameId, gameData);
    res.redirect(`/games/${gameId}/details`);
  } catch (err) {
    const error = getErrorMsg(err);
    res.render("games/edit", {
      title: "Edit Page",
      game,
      platform: getPlatform,
      error,
    });
  }
});

/*##################
####### DELETE ###
###################*/

router.get("/:gameId/delete", isAuth, async (req, res) => {
  const gameId = req.params.gameId;
  const userId = req.user._id;

  const isOwner = isGameOwner(gameId, userId);

  if (!isOwner) {
    return res.redirect("/404");
  }

  await gameService.remove(gameId);

  res.redirect("/games/catalog");
});

/*##################
####### BUY ###
###################*/

router.get("/:gameId/buy", isAuth, async (req, res) => {
  const gameId = req.params.gameId;

  const userId = req.user._id;

  const isOwner = isGameOwner(gameId, userId);

  if (isOwner) {
    return res.redirect("/404");
  }

  try {
    await gameService.buy(gameId, userId);

    res.redirect(`/games/${gameId}/details`);
  } catch (err) {
    console.log(er);
  }
});

/*##################
####### SEARCH ###
###################*/
router.get("/search", async (req, res) => {
  const gamePlatform = getPlatformType({});
  const filter = req.query;

  const games = await gameService.getAll(filter).lean();

  res.render("games/search", {
    title: "Search - Gaming Team",
    platform: gamePlatform,
    games,
    filter,
  });
});

/*#######################
####### HELP FUNCTION ###
#########################*/
async function isGameOwner(gameId, userId) {
  const game = await gameService.getOne(gameId);
  const isOwner = game.owner.toString() === userId;
  return isOwner;
}

function getPlatformType({ gameData }) {
  const platformType = ["PC", "Nintendo", "PS4", "PS5", "XBOX"];

  const platformView = platformType.map((platform) => ({
    value: platform,
    label: platform,
    selected: gameData == platform ? "selected" : "",
  }));

  return platformView;
}

export default router;

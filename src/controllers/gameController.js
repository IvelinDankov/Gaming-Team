import { Router } from "express";
import { getErrorMsg } from "../utils/getErrorMsg.js";
import gameService from "../services/gameService.js";

const router = Router();

/*##################
####### CREATE ###
###################*/

router.get("/create", (req, res) => {
  const gameData = req.body;
  const gamePlatform = getPlatformType({});
  res.render("games/create", {
    title: "Create Page - Gaming Team",
    platform: gamePlatform,
  });
});

router.post("/create", async (req, res) => {
  const gameData = req.body;
  const ownerId = req.user._id;

  console.log(gameData);

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
  const games = await gameService.getAll().lean()

  res.render("games/catalog", {games});
});

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

import { Router } from "express";
import authService from "../services/authService.js";
import { getErrorMsg } from "../utils/getErrorMsg.js";
import { isAuth, isGuest } from "../middlewares/authMiddleware.js";

const router = Router();

/***********************
######## REGISTER ######
************************/
// GET
router.get("/register", isGuest, (req, res) => {
  res.render("auth/register", { title: "Register Page" });
});

// POST
router.post("/register", isGuest, async (req, res) => {
  const { username, email, password, rePass } = req.body;

  try {
    await authService.register(username, email, password, rePass);

    res.redirect("/");
  } catch (err) {
    const error = getErrorMsg(err);
    res.render("auth/register", {
      title: "Register Page",
      username,
      email,
      error,
    });
  }
});

/*##################
####### LOGIN ###
###################*/

// GET

router.get("/login",isGuest, (req, res) => {
  res.render("auth/login", { title: "Login Page" });
});

// POST
router.post("/login",isGuest, async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await authService.login(email, password);

    res.cookie("auth", token);

    res.redirect("/");
  } catch (err) {
    const error = getErrorMsg(err);
    res.render("auth/login", {
      title: "Login Page",
      email,
      error,
    });
  }
});

/*##################
####### LOGOUT ###
###################*/

router.get("/logout", isAuth, (req, res) => {
  res.clearCookie("auth");

  res.redirect("/");
});

export default router;

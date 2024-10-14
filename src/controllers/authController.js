import { Router } from "express";
import authService from "../services/authService.js";

const router = Router();

/***********************
######## REGISTER ######
************************/
// GET
router.get("/register", (req, res) => {
  res.render("auth/register");
});

// POST
router.post("/register", async (req, res) => {
  const { username, email, password, rePass } = req.body;

  await authService.register(username, email, password, rePass);

  res.redirect("/auth/login");
});

/*##################
####### LOGIN ###
###################*/

// GET

router.get("/login", (req, res) => {
  res.render("auth/login");
});

// POST
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const token = await authService.login(email, password);

  res.cookie("auth", token);

  res.redirect("/");
});

/*##################
####### LOGOUT ###
###################*/

router.get("/logout", (req, res) => {
  res.clearCookie("auth");

  res.redirect("/");
});

export default router;

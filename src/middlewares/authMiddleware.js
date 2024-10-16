import jwt from "jsonwebtoken";

import "dotenv/config";

export const authMiddleware = (req, res, next) => {
  const token = req.cookies["auth"];

  if (!token) {
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);

    req.user = decodedToken;
    req.isAuthenticated = true;
    res.locals.isAuthenticated = true;
    res.locals.email = decodedToken.email;
    res.locals.username = decodedToken.username;

    next();
  } catch (err) {
    console.log(err.message);
  }
};


export const isAuth = (req, res, next) => {
  if (!req.user) {
        res.redirect('/auth/login')
  }
  
  next();
}

export const isGuest = (req, res, next) => {
  if (req.user) {
    return res.redirect('/404');


  }

  next();
}
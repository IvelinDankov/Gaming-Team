import express from 'express';
import router from './router.js';
import handlebars from "express-handlebars";
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { authMiddleware } from './middlewares/authMiddleware.js';


const app = express();

app.use(express.static('src/public'));
app.use(express.urlencoded({ extended: false }));

const url = "mongodb://localhost:27017/GameCode"

mongoose.connect(url)
    .then(() => console.log("Successfully connected to DB :)"))
    .catch(() => console.log("You are not connected to DB :("))

app.engine('hbs', handlebars.engine({
    extname: '.hbs'
}));

app.set('view engine', 'hbs');
app.set('views', 'src/views');

app.use(cookieParser());
app.use(authMiddleware);

app.use(router);
app.listen(3000, () => "Server is listening on port 3000");


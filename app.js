// include it if we are just in the development mode
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// to start server
const express = require("express");
const app = express();

// required to run sockets
const server = require('http').createServer(app);

// socket for run-time programming
const socketIO = require('socket.io');
const io = socketIO(server);

// cookies
const session = require("express-session");

// flash
const flash = require("connect-flash");

// to use http mehods like (put, patch, delete)
const methodOverride = require("method-override");

// get the path to run from any dir
const path = require("path");

const ejsMate = require("ejs-mate");

// get routes
const userRoutes = require("./routes/users");
const postRoutes = require("./routes/posts");
const commentRoutes = require("./routes/comments");
const requestRoutes = require("./routes/requests");
const chatRoutes = require("./routes/chats");

// get sockets
const notificationSocket = require('./sockets/notification');
const chatSocket = require('./sockets/chat');

// to use mongodb
const mongoose = require("mongoose");

// mongo sessions
const MongoDBStore = require("connect-mongo");

// authanecation package
const passport = require("passport");
const localStrategy = require("passport-local");

// users
const User = require("./models/user");

// to start connection with mongodb
//mongodb://127.0.0.1:27017/saa3d
mongoose
    .connect(process.env.DB_URL)
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!");
    })
    .catch((err) => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!");
        console.log(err);
    });

// to run sockets functions
notificationSocket(io);
chatSocket(io);

// Views folder and EJS setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// to parse form data in POST request body
app.use(express.urlencoded({ extended: true }));

// To 'fake' put/patch/delete requests
app.use(methodOverride("_method"));

app.engine("ejs", ejsMate);

// to use static files in public folder
app.use(express.static(path.join(__dirname, "public")));

const sessionConfig = {
    // store sessions in db instead of memory
    store: MongoDBStore.create({
        mongoUrl: process.env.DB_URL,
        secret: process.env.SECRET,
        touchAfter: 24 * 60 * 60 // not to save it every time the page is refreshed
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
    },
};
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// to send data to all templates (local variables)
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/", userRoutes);
app.use("/", postRoutes);
app.use("/request/", requestRoutes);
app.use("/chat/", chatRoutes);
app.use('/post/:postId/comments/', commentRoutes);

app.get("/", (req, res) => {
    res.render("home");
});

app.all("*", (req, res, next) => {
    res.render("error");
});

app.use((err, req, res, next) => {
    const { statusCode = 400, message = "something went wrong" } = err;
    res.status(statusCode).render("error", { err });
});

server.listen(process.env.PORT, () => {
    console.log(`ON PORT ${process.env.PORT}`);
});
const express = require("express");
const cors = require("cors");
const loginRouter = require("./routes/login");
const app = express();
const session = require("express-session");
require("dotenv").config();

const passport = require("passport");

app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Passport middleware
passport.serializeUser(function (user, done) {
  done(null, user.id); // Serialize only the user ID
});

passport.deserializeUser(function (id, done) {
  User.findByPk(id) // Fetch the full user object
    .then((user) => {
      done(null, user);
    })
    .catch((err) => done(err));
});

app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(express.json());
app.use("/login", loginRouter);

app.listen(8101, () => {
  console.log("server started");
});

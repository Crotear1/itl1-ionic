require("dotenv").config();
const express = require("express");
const db = require("../models/index");

const bcrypt = require("bcrypt");

// Passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const jwt = require("jsonwebtoken");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const saltRounds = 10;
const jwtOptions = {
  secretOrKey: "1234",
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};
// Database reference
const { User } = db;

const router = express.Router();

//  Passport authenticaton

passport.use(
  "clientLocal",
  new LocalStrategy((username, password, done) => {
    User.findOne({ where: { username: username }, raw: false })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "Incorrect username." });
        }
        if (!bcrypt.compareSync(password, user.password)) {
          return done(null, false, { message: "Incorrect password." });
        }
        return done(null, user);
      })
      .catch((err) => (null, false, err));
  })
);

passport.use(
  "clientJwt",
  new JwtStrategy(jwtOptions, (jwtPayload, done) => {
    User.findOne({ where: { id: jwtPayload.id }, raw: false })
      .then((user) => {
        if (!user) {
          return done(null, false, { message: "Incorrect user." });
        }
        return done(null, user);
      })
      .catch((err) => (null, false, err));
  })
);

// Register API
router.post("/register", (req, res) => {
  console.log(req.body);
  if (req.body.username && req.body.password) {
    User.findOne({ where: { username: req.body.username }, raw: false })
      .then((user) => {
        if (user) {
          res.status(401).json({ message: "Username already exists" });
        } else {
          const hash = bcrypt.hashSync(req.body.password, saltRounds);
          User.create({
            username: req.body.username,
            password: hash,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            type: "client",
            stripeId: req.body.stripeId,
          })
            .then((userNew) => {
              const payload = { id: userNew.id };
              const token = jwt.sign(payload, process.env.JWT_SECRET);
              res.json({ token });
            })
            .catch(() => {
              res.status(401).json({ message: "Error Creating User" });
            });
        }
      })
      .catch((err) => {
        res.status(401).json({ message: err });
      });
  } else {
    res.status(401).json({ message: "Insufficient Information to register" });
  }
});

// Login API
router.post("/login", (req, res, next) => {
  passport.authenticate("clientLocal", (err, user, info) => {
    if (err) {
      return next(err);
    } // Pass error to error handling middleware
    if (!user) {
      return res.status(401).json({ success: false, info });
    }
    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }
      const payload = { id: req.user.id };
      const token = jwt.sign(payload, process.env.JWT_SECRET);

      return res.json({ token });
    });
  })(req, res, next); // Note the extra (req, res, next) here
});

// Get User API
router.get(
  "/:id",
  passport.authenticate(["adminJwt", "driverJwt"], { session: false }),
  (req, res) => {
    const clientId = req.params.id;
    return User.findOne({
      where: {
        id: clientId,
      },
      raw: false,
    }).then((result) => {
      res.send(result);
    });
  }
);

module.exports = router;

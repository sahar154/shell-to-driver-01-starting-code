const Router = require("express").Router;
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const router = Router();

const mongodb = require("mongodb"); // 1
const db = require("../db");

const createToken = () => {
  return jwt.sign({}, "secret", { expiresIn: "1h" });
};

router.post("/login", (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  db.getdb()
    .db()
    .collection("users")
    .findOne({ email: email })
    .then((userData) => {
      return bcrypt.compare(pw, userData.password);
    })
    .then((bcryptResult) => {
      if (!bcryptResult) {
        // pw is not correct
        throw Error();
      }
      // Check if user login is valid
      // If yes, create token and return it to client
      const token = createToken();
      res.status(200).json({
        message: "Authentication succeeded.",
        token: token,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(401).json({
        message: "Authentication failed, invalid username or password.",
      });
    });
});

router.post("/signup", (req, res, next) => {
  const email = req.body.email;
  const pw = req.body.password;
  // Hash password before storing it in database => Encryption at Rest
  bcrypt
    .hash(pw, 12)
    .then((hashedPW) => {
      console.log(hashedPW);
      db.getdb()
        .db()
        .collection("users")
        .insertOne({
          email: email,
          password: hashedPW,
        })
        .then((result) => {
          console.log("sign up pw is " + pw);
          console.log("bcrypt pw " + hashedPW);
          console.log(result);
          const token = createToken();
          res.status(201).json({ token: token, user: { email: email } });
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json({ message: "Creating the user failed." });
        });
      // Store hashedPW in database
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: "Creating the user failed." });
    });
  // Add user to database
});

module.exports = router;

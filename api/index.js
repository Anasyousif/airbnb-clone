const express = require("express");
const cors = require("cors");
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user.js");
const app = express();
const cookieParser = require('cookie-parser');
require("dotenv").config();

const bcryptSlat = bcrypt.genSaltSync(10);
const jwtSecret = "sdjhaslidi";
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

mongoose.connect(process.env.MONGO_URL);

app.get("/test", (req, res) => {
  res.json("test ok");
});

//Dawood100
app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userDoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptSlat),
    });

    res.json(userDoc);
  } catch (error) {
    res.status(422).json(e);
  }

  app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passOK = bcrypt.compareSync(password, userDoc.password);
      if (passOK) {
        jwt.sign(
          { email: userDoc.email, id: userDoc._id},
          jwtSecret,{},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json(userDoc);
          }
        );
      } else {
        res.status(422).json("pass not ok");
      }
    } else {
      res.json("not found");
    }
  });

  app("/profile", (req, res) => {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const {name, email , _id} = await User.findById(userData.id);
        res.json({name, email , _id});
      });
    } else {
      res.json(null);
    }
    res.json({ token });
  });
});

app.post('/logout', (req,res) => {
  res.cookie('token', '').json(true)
})


app.listen(4000);

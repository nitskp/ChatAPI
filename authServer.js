require("dotenv").config();
const bcrypt = require("bcrypt");
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const User = require("./routes/api/models/User");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(
  "mongodb://localhost/UsersData",
  () => console.log("Database Connected"),
  (err) => console.log(err)
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Login Functionality
// POST REQUEST
app.post("/auth/login", async (req, res) => {
  console.log(req.body);
  const { userID, password } = req.body;
  console.log("Password Sent:", password);
  const user = await User.find({ userID: userID });
  console.log(user)
  if (user.length===0) {
    return res.status(401).send("User is not in the database");
  } else {
    console.log(user[0].password);
    const result = await bcrypt.compare(password, user[0].password);
    if (result) {
      const person = {
        userID: userID,
        password: password,
      };
      const accessToken = jwt.sign(person, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
      });
      return res.json({
        message: "Login Sucessful",
        jwtToken: accessToken,
      });
    } else {
      return res.send("Password didn't match");
    }
  }
 
});

// static site
app.use(express.static(path.join(__dirname, "public", "loginPage")));

app.listen(PORT, () => {
  console.log(`Server started on the port ${PORT}`);
});

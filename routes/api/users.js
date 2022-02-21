const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("./models/User");
const bcrypt = require("bcrypt");
const verifyJWT = require('../../middleware/verifyJWT')

// Connecting to the database
mongoose.connect(
  "mongodb://localhost/UsersData",
  () => console.log("Database Connected"),
  (err) => console.error(err)
);

//GET REQUESTS
// get all users
router.get("/", verifyJWT,(req, res) => {
  console.log("API called");
  const findAll = async () => {
    const USERS = await User.find();
    return USERS
      ? res.json(USERS)
      : res.json({
          message: "Database empty",
        });
  };
  findAll();
});
//get a user on the basis of userID
router.get("/:userID",verifyJWT, (req, res) => {
  //   console.log(req.params.userID);

  const findOne = async () => {
    const USER = await User.find({ userID: req.params.userID });
    return USER.length
      ? res.json(USER)
      : res.status(400).json({
          message: `No user for userID ${req.params.userID}`,
        });
  };

  findOne();
});

// POST REQUEST
// add a user
router.post("/", async (req, res) => {
  if (
    req.body &&
    Object.keys(req.body).length &&
    Object.getPrototypeOf(req.body) === Object.prototype
  ) {
    const userData = {
      userID: req.body.userID,
      name: req.body.name,
      password: await bcrypt.hash(req.body.password, 10),
      email: req.body.email,
      phone: req.body.phone,
      messages: req.body.messages,
    };
    
      const USER = new User(userData);
      await USER.save();
      return res.send(USER);
  
  } else {
    return res.status(400).json({
      message: "No data send",
    });
  }
});

// DELETE REQUEST
// delete a user according to the userID send
router.delete("/:userID",verifyJWT, (req, res) => {
  const deleteUser = async (userID) => {
    const deleteCount = await User.deleteMany({ userID: userID });

    return deleteCount.deletedCount
      ? res.send(`User Deleted`)
      : res.status(400).json({
          message: `No user with ${req.params.userID} userID`,
        });
  };
  deleteUser(req.params.userID);
});

// PATCH REQUEST
// update a user according to userID and the things to update are in the body.
router.patch("/:userID",verifyJWT, async (req, res) => {
  const bodyData = req.body;
  const dataToUpdate = {};
  bodyData.userID
    ? (dataToUpdate.userID = bodyData.userID)
    : console.log("userId not updated");
  bodyData.name
    ? (dataToUpdate.name = bodyData.name)
    : console.log("name not updated");
  bodyData.password
    ? (dataToUpdate.password = await bcrypt.hash(bodyData.password, 10))
    : console.log("Password not updated");
  bodyData.email
    ? (dataToUpdate.email = bodyData.email)
    : console.log("Email not updated");
  bodyData.phone
    ? (dataToUpdate.phone = bodyData.phone)
    : console.log("Phone not updated");
  bodyData.messages
    ? (dataToUpdate.messages = bodyData.messages)
    : console.log("Messages not updated");
  // messages: req.body.messages,

  const updateData = async (userID, dataToUpdate) => {
    const modified = await User.updateOne({ userID: userID }, dataToUpdate);
    const USER = await User.find({ userID: userID });
    return modified.modifiedCount
      ? res.send(`User Modified\n${USER}`)
      : res.status(400).json({
          message: `No user with ${userID} userID`,
        });
  };
  updateData(req.params.userID, dataToUpdate);
});




module.exports = router;

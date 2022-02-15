const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("./models/User");

mongoose.connect(
  "mongodb://localhost/UsersData",
  () => console.log("Database Connected"),
  (err) => console.error(err)
);

// const USERS = require("../../data/Users");

//GET REQUESTS
// get all users
router.get("/", (req, res) => {
  const findAll = async () => {
    const USERS = await User.find();
    return res.json(USERS);
  };
  findAll();
});
//get a user on the basis of userID
router.get("/:userID", (req, res) => {
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
router.post("/", (req, res) => {
  if (
    req.body &&
    Object.keys(req.body).length &&
    Object.getPrototypeOf(req.body) === Object.prototype
  ) {
    const userData = req.body;
    const addUser = async (userData) => {
      const USER = new User(userData);
      await USER.save();
      console.log(USER);
    };
    addUser(userData);
    res.send("User Added");
  } else {
    return res.status(400).json({
      message: "No data send",
    });
  }
});

// DELETE REQUEST
// delete a user according to the userID send
router.delete("/:userID", (req, res) => {
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

// PUT REQUEST
// update a user according to userID and the things to update are in the body.
router.put("/:userID", (req, res) => {
  const dataToUpdate = req.body;
  const updateData = async (userID, dataToUpdate) => {
    const modified = await User.updateOne({ userID: userID }, dataToUpdate);
    return modified.modifiedCount
      ? res.send(`User Modified`)
      : res.status(400).json({
          message: `No user with ${userID} userID`,
        });
  };
    updateData(req.params.userID,dataToUpdate)
  
});

module.exports = router;

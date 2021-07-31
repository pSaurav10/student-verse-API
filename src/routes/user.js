const express = require("express");
const router = express.Router();
const User = require("../model/user.js");
const userController = require("../controller/user.controller.js");
const { guard } = require("../auth/auth");

router.get("/", (req, res) => {
  res.send("User routes");
});

// User Signup
router.post("/signup", userController.userSignup);
router.post("/login", userController.userLogin);
router.get("/profile", guard, userController.getUser);
router.get("/user/:id", guard, userController.findUser);
router.put("/user/update", guard, userController.updateUser);
router.get("/logout", userController.Logout);

module.exports = router;

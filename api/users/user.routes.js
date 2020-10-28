const { Router } = require("express");
const UserController = require("./users.controller");

const router = Router();

// router.get("/auth/register", (req, res) => res.send("ok"));

router.post(
  "/auth/register",
  UserController.validateUserRegister,
  UserController.registerUser
);

router.put(
  "/auth/login",
  UserController.validateUserLogin,
  UserController.login
);

router.get("/auth/", UserController.authorize, UserController.getUsers);

router.get(
  "/users/current",
  UserController.authorize,
  UserController.getCurrentUser
);

router.put("/auth/logout", UserController.authorize, UserController.logout);

module.exports = router;

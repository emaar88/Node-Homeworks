const { Router } = require("express");
const UserController = require("./users.controller");

const router = Router();

router.post(
  "/register",
  UserController.validateUserRegister,
  UserController.registerUser
);

router.put("/login", UserController.validateUserLogin, UserController.login);

router.get("/", UserController.authorize, UserController.getUsers);

router.get("/current", UserController.authorize, UserController.getCurrentUser);

router.put("/logout", UserController.authorize, UserController.logout);

module.exports = router;

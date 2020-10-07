const { Router } = require("express");
const ContactController = require("./contacts.controller");

const contactRouter = Router();

contactRouter.get("/api/contacts", ContactController.getUsers);

contactRouter.get("/api/contacts/:contactId", ContactController.getUsersId);

contactRouter.post(
  "/api/contacts",
  ContactController.validateCreateUser,
  ContactController.createUser
);

contactRouter.delete("/api/contacts/:contactId", ContactController.deleteUser);

contactRouter.patch(
  "/api/contacts/:contactId",
  ContactController.validateUserUpdate,
  ContactController.updateUser
);

module.exports = contactRouter;

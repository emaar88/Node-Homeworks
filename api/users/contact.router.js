const { Router } = require("express");
const ContactController = require("./contacts.controller");

const userRouter = Router();

userRouter.get("/contacts", ContactController.getContacts);

userRouter.post(
  "/contacts",
  ContactController.validateCreateContact,
  ContactController.createContact
);

userRouter.patch(
  "/contacts/:contactId",
  ContactController.validateContactUpdate,
  ContactController.updateContact
);

userRouter.delete("/contacts/:contactId", ContactController.deleteContact);

module.exports = userRouter;

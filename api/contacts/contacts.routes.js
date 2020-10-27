const { Router } = require("express");

const ContactsController = require("./contacts.controller");

const router = Router();

router.post("/contacts", ContactsController.createNewUser);

router.get("/contacts", ContactsController.getContacts);

router.get("/contacts/:contactId", ContactsController.getContactById);

router.patch("/contacts/:contactId", ContactsController.updateContact);

router.delete("/contacts/:contactId", ContactsController.deleteContact);

module.exports = router;

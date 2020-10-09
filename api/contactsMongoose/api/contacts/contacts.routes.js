const { Router } = require("express");

const ContactsController = require("./contacts.controller");

const router = Router();

router.post("/contacts", ContactsController.createNewUser);

module.exports = router;

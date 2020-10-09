const mongoose = require("mongoose");
const ContactModel = require("./contacts.model");

class ContactsController {
  async createNewUser(req, res, next) {
    try {
      const newContact = await ContactModel.create(req.body);
      return res.send(newContact);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ContactsController();

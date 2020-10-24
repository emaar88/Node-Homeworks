const mongoose = require("mongoose");
const ContactModel = require("./contacts.model");

class ContactsController {
  async createNewUser(req, res, next) {
    try {
      const newContact = await ContactModel.create(req.body);
      return res.status(201).send(newContact);
    } catch (err) {
      next(err);
    }
  }

  async getContacts(req, res, next) {
    try {
      const contacts = await ContactModel.find();
      return res.send(contacts);
    } catch (err) {
      // next(err);
      return res
        .status(400)
        .send({ error: err.message ? err.message : "Sometheing went wrong" });
    }
  }

  async getContactById(req, res, next) {
    try {
      const contactById = await ContactModel.findById(req.params.contactId);

      if (!contactById) {
        return res.status(404).send({ message: "Contact was not found" });
      }
      return res.send(contactById);
    } catch (err) {
      next(err);
    }
  }

  async updateContact(req, res, next) {
    try {
      const updatedContact = await ContactModel.findByIdAndUpdate(
        req.params.contactId,
        req.body,
        { new: true }
      );
      if (!updatedContact) {
        return res.status(404).send({ message: "Contact was not found" });
      }
      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  async deleteContact(req, res, next) {
    try {
      const deletedContact = await ContactModel.findByIdAndDelete(
        req.params.contactId
      );
      if (!deletedContact) {
        return res.status(404).send({ message: "Contact was not found" });
      }
      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ContactsController();

const Joi = require("joi");
const { promises: fsPromises } = require("fs");
const path = require("path");

const contactsPath = path.join(__dirname, "/../../db/contacts.json");

class ContactController {
  async getContacts(req, res, next) {
    try {
      let contacts = JSON.parse(
        await fsPromises.readFile(contactsPath, "utf-8")
      );
      return res.status(200).send(contacts);
    } catch (err) {
      next(err);
    }
  }

  async getContactById(req, res, next) {
    try {
      let contacts = JSON.parse(
        await fsPromises.readFile(contactsPath, "utf-8")
      );
      const id = parseInt(req.params.contactId);

      const targetContactsIndex = contacts.findIndex(
        (contact) => contact.id === id
      );

      if (targetContactsIndex === -1) {
        return res.status(404).send({ message: "Not found" });
      }

      if (!targetContactsIndex) {
        return res.status(404).send({ message: "Contact not found" });
      }
      return res.status(200).send(contacts[targetContactsIndex]);
    } catch (err) {
      next(err);
    }
  }

  async createContact(req, res, next) {
    try {
      let contacts = JSON.parse(
        await fsPromises.readFile(contactsPath, "utf-8")
      );
      contacts.push({
        id: contacts.length + 1,
        ...req.body,
      });
      await fsPromises.writeFile(contactsPath, JSON.stringify(contacts));
      return res.status(201).send({ message: "Contact created" });
    } catch (err) {
      next(err);
    }
  }

  async deleteContact(req, res, next) {
    try {
      let contacts = JSON.parse(
        await fsPromises.readFile(contactsPath, "utf-8")
      );
      const id = parseInt(req.params.contactId);

      const targetContactsIndex = contacts.findIndex(
        (contact) => contact.id === id
      );

      if (targetContactsIndex === -1) {
        return res.status(404).send({ message: "Not found" });
      }

      if (!targetContactsIndex) {
        return res.status(404).send({ message: "Contact not found" });
      }

      contacts.splice(targetContactsIndex, 1);
      await fsPromises.writeFile(contactsPath, JSON.stringify(contacts));
      return res.status(200).end();
    } catch (err) {
      next(err);
    }
  }

  async updateContact(req, res, next) {
    try {
      let contacts = JSON.parse(
        await fsPromises.readFile(contactsPath, "utf-8")
      );
      const id = parseInt(req.params.contactId);

      const targetContactsIndex = contacts.findIndex(
        (contact) => contact.id === id
      );

      if (targetContactsIndex === -1) {
        return res.status(404).send({ message: "Not found" });
      }

      if (!targetContactsIndex) {
        return res.status(404).send({ message: "Contact not found" });
      }

      contacts[targetContactsIndex] = {
        ...contacts[targetContactsIndex],
        ...req.body,
      };
      await fsPromises.writeFile(contactsPath, JSON.stringify(contacts));

      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  validateContactUpdate(req, res, next) {
    const updateSchemaValidator = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
    });

    ContactController.checkValidationError(
      updateSchemaValidator,
      req,
      res,
      next
    );
  }

  validateCreateContact(req, res, next) {
    const createSchemaValidator = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
    });

    ContactController.checkValidationError(
      createSchemaValidator,
      req,
      res,
      next
    );
  }

  static checkValidationError(schema, req, res, next) {
    const { error } = schema.validate(req.body);

    if (error) {
      const { message } = error.details[0];
      return res.status(400).send({ error: message });
    }
    next();
  }
}

module.exports = new ContactController();

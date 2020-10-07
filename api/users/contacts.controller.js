const Joi = require("joi");

const contacts = require("../../db/contacts.json");

class ContactController {
  getContacts(req, res, next) {
    try {
      return res.send(contacts);
    } catch (err) {
      next(err);
    }
  }

  getContactById(req, res, next) {
    try {
      const targetContactsIndex = ContactController.findContactIndexById(
        req.params.id,
        res
      );

      if (targetContactsIndex === undefined) {
        return res.status(404).send({ message: "Contact not found" });
      }

      return res.status(200).send(contacts);
    } catch (err) {
      next(err);
    }
  }

  createContact(req, res, next) {
    try {
      contacts.push({
        id: contacts.length + 1,
        ...req.body,
      });

      return res.status(201).send({ message: "Contact created" });
    } catch (err) {
      next(err);
    }
  }

  deleteContact(req, res, next) {
    try {
      const targetContactsIndex = ContactController.findContactIndexById(
        req.params.id,
        res
      );

      if (targetContactsIndex === undefined) {
        return;
      }

      contacts.splice(targetContactsIndex, 1);

      return res.status(200).end();
    } catch (err) {
      next(err);
    }
  }

  updateContact(req, res, next) {
    try {
      const targetContactsIndex = ContactController.findContactIndexById(
        req.params.id,
        res
      );

      if (targetContactsIndex === undefined) {
        return res.status(404).send({ message: "Contact not found" });
      }

      contacts[targetContactsIndex] = {
        ...contacts[targetContactsIndex],
        ...req.body,
      };

      return res.status(204).end();
    } catch (err) {
      next(err);
    }
  }

  validateContactUpdate(req, res, next) {
    const updateSchemaValidator = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
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
      password: Joi.string().required(),
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

  static findContactIndexById(contactId, res) {
    const id = parseInt(contactId);
    const targetContactsIndex = contacts.findIndex(
      (contact) => contact.id === id
    );

    if (targetContactsIndex === -1) {
      return res.status(404).send({ message: "Not found" });
    }

    return targetContactsIndex;
  }
}

module.exports = new ContactController();

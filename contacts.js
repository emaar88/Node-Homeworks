const { promises: fsPromises } = require("fs");
const path = require("path");
const shortid = require("shortid");

let contactsPath = path.join(__dirname, "./db/contacts.json");

async function listContacts() {
  try {
    const data = JSON.parse(await fsPromises.readFile(contactsPath, "utf-8"));
    console.table(data);
  } catch (error) {
    console.log(error);
  }
}

async function getContactById(contactId) {
  try {
    const data = JSON.parse(await fsPromises.readFile(contactsPath, "utf-8"));
    const foundedContact = data.find(({ id }) => id === contactId);
    console.table(foundedContact);
  } catch (error) {
    console.log(error);
  }
}

async function removeContact(contactId) {
  try {
    const data = JSON.parse(await fsPromises.readFile(contactsPath, "utf-8"));
    const afterDeleteContacts = data.filter(({ id }) => id !== contactId);
    await fsPromises.writeFile(
      contactsPath,
      JSON.stringify(afterDeleteContacts)
    );
    console.table(afterDeleteContacts);
  } catch (error) {
    console.log(error);
  }
}

async function addContact(name, email, phone) {
  try {
    const data = JSON.parse(await fsPromises.readFile(contactsPath, "utf-8"));
    const newContact = {
      id: shortid.generate(shortid.seed(1000)),
      name,
      email,
      phone,
    };
    const addedContact = [...data, newContact];
    await fsPromises.writeFile(contactsPath, JSON.stringify(addedContact));
    console.table(addedContact);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
};

const express = require("express");
// const mongodb = require("mongodb");
const { MongoClient, ObjectId } = require("mongodb");
const logger = require("morgan");

const app = express();

app.use(express.json());

app.use(logger("dev"));

let db;
let collection;
// async function dbConnection() {
//   const client = await mongodb.MongoClient.connect(
//     "mongodb+srv://serhii:homework3@cluster0.hrfr3.mongodb.net/db-contacts?retryWrites=true&w=majority",
//     { useUnifiedTopology: true }
//   );
async function dbConnection() {
  const client = await MongoClient.connect(
    "mongodb+srv://serhii:homework3@cluster0.hrfr3.mongodb.net/db-contacts?retryWrites=true&w=majority",
    { useUnifiedTopology: true }
  );
  db = client.db("db-contacts");

  collection = db.collection("contacts");

  console.log("DB connected succesfully");
}

dbConnection().catch((err) => console.log(err));

app.get("/test", (req, res, next) => res.send("Express"));

app.post("/contacts", async (req, res, next) => {
  try {
    const { ops } = await collection.insertOne(req.body);
    return res.send(ops[0]);
  } catch (err) {
    console.log(err);
  }
});

app.get("/contacts", async (req, res, next) => {
  try {
    const contacts = await collection.find().toArray;
    return res.send(contacts);
  } catch (err) {
    console.log(err);
  }
});

app.get("/contacts/:contactId", checkObjectId, async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const contact = await collection.findOne({ _id: ObjectId(contactId) });
    return res.send(contact);
  } catch (err) {
    console.log(err);
  }
});

app.put("/contacts/:contactId", checkObjectId, async (req, res, next) => {
  try {
    const { contactId } = req.params;

    const contact = req.body;
    const modifiedContact = await collection.updateOne(
      {
        _id: ObjectId(contactId),
      },
      { $set: contact }
    );
    return res.send(modifiedContact);
  } catch (err) {
    console.log(err);
  }
});

app.delete("contacts/:contactId", checkObjectId, async (req, res, next) => {
  try {
    const { contactId } = req.params;

    // const contact = await collection.deleteOne({
    //   _id: ObjectId(contactId),
    // });
    const { deletedCount } = await collection.deleteOne({
      _id: ObjectId(contactId),
    });
    if (!deletedCount) {
      return res.send({ message: "User was not deleted!" });
    }

    return res.send({ message: "User was deleted" });
  } catch (err) {
    console.log(err);
  }
});

function checkObjectId(req, res, next) {
  if (!ObjectId.isValid(req.params.contactId)) {
    return res.send({ message: "ObjectId is not valid!" });
  }
  next();
}

app.listen(3000, () => console.log("Server was started"));

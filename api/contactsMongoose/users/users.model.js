const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");

const UserSсhema = new Schema({
  email: String,
  password: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free",
  },
  token: String,
});
module.exports = model("User", UserSсhema);

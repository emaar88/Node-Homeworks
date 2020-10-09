const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    validate: (email) => {
      if (!email.includes("@")) {
        throw new Error("Email must have @");
      }

      return true;
    },
    required: true,
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{2}-\d{2}/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
  subscription: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: false },
});

module.exports = model("Contact", contactSchema);

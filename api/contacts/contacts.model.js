const { Schema, model } = require("mongoose");

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email",
    },
    required: [true, "Email required"],
  },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /\d{3}-\d{3}-\d{4}/.test(v);
      },
      message: (props) =>
        `${props.value} is not a valid phone number! please use 3 digit-3 digit-4 digit`,
    },
    required: true,
  },
  subscription: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: false },
});

module.exports = model("Contact", contactSchema);

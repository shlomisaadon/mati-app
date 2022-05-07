/** @format */

const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },

  email: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 255,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  cards: Array,
});

userSchema.methods.generateAuthToken = function generateAuthToken() {
  return jwt.sign(
    {
      _id: this._id,
    },
    config.get("jwtKey")
  );
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    email: Joi.string().min(6).max(255).required(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(user);
}

function validateCards(data) {
  const schema = Joi.object({
    cards: Joi.array().min(1).required(),
  });
  return schema.validate(data);
}
module.exports = {
  User,
  validateUser,
  validateCards,
};

// const user = new User({
//     name:"shlomi",
//     password: "123456",
//     email: "shlomisaadon@gmail.com",
//     biz: true,
// });

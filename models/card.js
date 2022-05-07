/** @format */

const Joi = require("joi");
const mongoose = require("mongoose");
const _ = require("lodash");

const cardSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 255,
  },
  Description: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 1024,
  },
  Title: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 400,
  },
  Phone: {
    type: String,
    required: true,
    minlength: 9,
    maxlength: 10,
  },
  Card_id: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 99999999999,
    unique: true,
  },
  user_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
});

const Card = mongoose.model("Card", cardSchema);

function validateCard(card) {
  const schema = Joi.object({
    Name: Joi.string().min(2).max(255).required(),
    Description: Joi.string().min(2).max(1024).required(),
    Title: Joi.string().min(2).max(1024).required(),
    Phone: Joi.string()
      .min(9)
      .max(10)
      .required()
      .regex(/^0[2-9]\d{7,8}$/),
  });

  return schema.validate(card);
}

async function generateBizNumber() {
  while (true) {
    const randomNumber = _.random(1000, 9999999999);
    const card = await Card.findOne({ Card_id: randomNumber });
    if (!card) {
      return String(randomNumber);
    }
  }
}

module.exports = {
  Card,
  validateCard,
  generateBizNumber,
};

/** @format */

const router = require("express").Router();
const Joi = require("joi");
const {User} = require("../models/user");
const bcrypt = require("bcrypt");

//--------------------{authentication}------------------------------
// authentication
router.post("/", async (req, res) => {
  //------------------ {validate user's input} -----------------------
  const {error} = validate(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  //------------------ {validate system requirements} ----------------
  let user = await User.findOne({
    email: req.body.email,
  });
  if (!user) {
    res.status(400).send("Invalid email or password");
    return;
  }
  const isValidPassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!isValidPassword) {
    res.status(400).send("Invalid email or password");
    return;
  }

  //---------------------------- {process} ---------------------------
  const token = user.generateAuthToken();

  //---------------------------- {respond} ---------------------------
  res.json({token});
});
//---------------------------{Creat Token authentication}------------------------------------------

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required(),
  });

  return schema.validate(user);
}

module.exports = router;

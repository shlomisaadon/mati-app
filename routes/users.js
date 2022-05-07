/** @format */

const router = require("express").Router();
const { User, validateUser, validateCards } = require("../models/user");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const authMw = require("../middlewares/auth");
const { Card } = require("../models/card");

const getCards = async (cardsArray) => {
  const cards = await Card.find({ bizNumber: { $in: cardsArray } });
  return cards;
};

//-------------------------------{Delete cards  fav}-------------------------------
// router.delete("/:bizNum", authMw, async (req, res) => {
//   const card = await User.findOneAndUpdate(
//     {_id: req.user._id},
//     {$pull: {cards: req.params.bizNum}},
//     {multi: true}
//   );
//   console.log(card);
//   if (!card) {
//     res.status(404).send("The card with the given ID was not found.");
//     console.log(req.user._id);
//     console.log(req.params.bizNum);
//     return;
//   }

//   res.status(204).send(`The cards DELETE is `);
// });

//-------------------------------{Delete cards  fav}-------------------------------

//-------------------------------{Get /cards  fav}-------------------------------
// router.get("/cards", authMw, async (req, res) => {
//   if (!req.query.numbers) res.status(400).send("Missing numbers data");

//   let data = {};
//   data.cards = req.query.numbers.split(",");

//   const cards = await getCards(data.cards);
//   res.send(cards);
// });
//-------------------------------{Get /cards  fav}-------------------------------

//-------------------------------{Patch fav cards }-------------------------------
// router.patch("/cards", authMw, async (req, res) => {
//   const {error} = validateCards(req.body);
//   if (error) res.status(400).send(error.details[0].message);

//   const cards = await getCards(req.body.cards);
//   if (cards.length != req.body.cards.length) {
//     res.status(400).send("Card numbers don't match");
//     return;
//   }

//   let user = await User.findById(req.user._id);
//   const isExistsAlready = user.cards.some((card) => card === req.body.cards[0]);
//   if (isExistsAlready) {
//     res.status(400).send("already exists");
//     return;
//   }
//   console.log(isExistsAlready);

//   user.cards = [...new Set([...req.body.cards, ...user.cards])];
//   user = await user.save();
//   res.send(user);
// });
//-------------------------------{Patch fav cards }-------------------------------

//-------------------------------{Get ALL cards User By ID}-------------------------------
router.get("/all", authMw, async (req, res) => {
  const users = await User.find({});
  res.send(users);
});
//-------------------------------{Get ALL cards User By ID}-------------------------------

//-------------------------------{Get  cards Favorite User cards}-------------------------------
// router.get("/cardFev", authMw, async (req, res) => {
//   const cardsFev = await User.find({});
//   res.send(cardsFev);
// });
//-------------------------------{Get  cards Favorite User cards}-------------------------------

//-------------------------------{Get User By ID}-------------------------------
router.get("/me", authMw, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
  console.log(req.user);
});
//-------------------------------{Get User By ID}-------------------------------

//-------------------------------{Creat New User}-------------------------------
router.post("/", async (req, res) => {
  //------------------ {validate user's input} -----------------------
  const { error } = validateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  //------------------ {validate system requirements} ----------------

  // User.findOne({email: req.body.email}).then(user=> {})
  let user = await User.findOne({ email: req.body.email });
  if (user) {
    res.status(400).send("User already exists");
    return;
  }
  //---------------------------- {process} ---------------------------
  // create user
  user = new User(req.body);
  const salt = await bcrypt.genSalt(12);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  //---------------------------- {respond} ---------------------------
  //send user's information
  res.status(200).send(_.pick(user, ["_id", "name", "email"]));
});
//----------------------------------------------{Creat New User}------------------------------------------

module.exports = router;

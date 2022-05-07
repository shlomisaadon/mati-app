/** @format */

const router = require("express").Router();
const { Card, validateCard, generateBizNumber } = require("../models/card");
const _ = require("lodash");
const authMw = require("../middlewares/auth");
const { User } = require("../models/user");

//--------------------------{Get All Card by ID}------------------------------------------
router.get("/allById", authMw, async (req, res) => {
  const cards = await Card.find({ user_id: req.user._id });
  res.send(cards);
});
//--------------------------{Get All Card by ID}------------------------------------------

//--------------------------{Get All}------------------------------------------
router.get("/all", authMw, async (req, res) => {
  const cards = await Card.find({});
  res.status(200).send(cards);
});
//--------------------------{Get All}------------------------------------------

//--------------------------{Update Card}------------------------------------------
router.put("/:id", authMw, async (req, res) => {
  //------------------ {validate user's input} -----------------------
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  //------------------ {validate system requirements} ----------------

  let card = await Card.findByIdAndUpdate(
    {
      _id: req.params.id,
      user_id: req.user._id,
    },
    req.body
  );
  if (!card) {
    res.status(404).send("The card with the given ID was not found.");
    return;
  }
  //---------------------------- {process} ---------------------------
  card = await Card.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });

  res.send(card);
});
//--------------------------{Update Card}------------------------------------------

//--------------------------{Find Card}------------------------------------------
router.get("/:id", authMw, async (req, res) => {
  const card = await Card.findOne({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card) {
    res.status(404).send("The card with the given ID was not found.");
    return;
  }
  res.send(card);
});
//--------------------------{Find Card}------------------------------------------

//--------------------------{Remove Card}------------------------------------------

router.delete("/:id", authMw, async (req, res) => {
  const card = await Card.findOneAndRemove({
    _id: req.params.id,
    user_id: req.user._id,
  });
  if (!card) {
    res.status(404).send("The card with the given ID was not found.");
    return;
  }

  res.send(`The cards DELETE is : \r\n`, { card });
});

//--------------------------{Remove Card}------------------------------------------

//--------------------------{Creat New Card}------------------------------------------
router.post("/", authMw, async (req, res) => {
  //------------------ {validate user's input} -----------------------
  const { error } = validateCard(req.body);
  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }
  //------------------ {validate system requirements} ----------------
  // const isBiz = await User.findOne({biz: true});
  // if (!isBiz) {
  //   return `You don't have Business`;
  // }
  //---------------------------- {process} ---------------------------

  let card = new Card({
    ...req.body,
    Card_id: await generateBizNumber(),
    user_id: req.user._id,
  });

  //---------------------------- {respond} ---------------------------
  await card.save();
  res.status(200).send(`The Card Creat successful ->> \r\n ${card}`);
});

//--------------------------{Creat New Card}------------------------------------------

module.exports = router;

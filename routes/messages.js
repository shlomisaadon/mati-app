const router = require("express").Router();
const WwebjsSender = require("@deathabyss/wwebjs-sender");
const client = require("../Client/client");
const { Buttons } = require("whatsapp-web.js");

router.get("/client", async (req, res, next) => {
  const data = client.info;
  res.send([data]);
});

router.get("/contacts", async (req, res, next) => {
  const data = await client.getContacts().then((data) => {
    const myContacts = data.filter(
      (data) =>
        data.name === "אשתי היקרה" ||
        data.name === "קידום מעדניית מאיה" ||
        data.name === "קידום מעדניית מאיה"
    );
    res.send(myContacts);
  });
});

router.post("/sendByName", async (req, res, next) => {
  try {
    console.log(req.body);
    const chat = await client.getChats().then((chats) => {
      const myGroup = chats.find((chat) => chat.name === req.body.name);
      if (!myGroup) {
        return console.log("not have user like that");
      }
      res.send(myGroup);
      client.sendMessage(myGroup.id._serialized, req.body.msg);
    });
  } catch (error) {
    next(error);
  }
});

router.post("/sendMessageNumber", async (req, res, next) => {
  try {
    let button = new Buttons(
      "hey",
      [{ body: "btn1" }, { body: "btn2" }],
      "hello",
      "by by"
    );
    const { number, message } = req.body; // Get the body
    console.log(number);
    client.sendMessage(number, button);
    client.sendMessage(number, "button");
    res.send(button);
    // const msg = await client.sendMessage(`${number}@c.us`, message); // Send the message
    // res.send({ msg }); // Send the response
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;

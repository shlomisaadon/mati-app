//https://www.npmjs.com/package/wbm

const qrcode = require("qrcode-terminal");

const { Client, NoAuth } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new NoAuth(),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
  client.sendMessage();
});

client.on("message", (message) => {
  console.log(message.body);
});

client.initialize();

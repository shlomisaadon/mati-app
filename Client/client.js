const {
  Client,
  Buttons,
  LocalAuth,
  MessageMedia,
  MessageTypes,
  MessageAck,
} = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const fs = require("fs");
const axios = require("axios");
const schedule = require("node-schedule");
const WwebjsSender = require("@deathabyss/wwebjs-sender");
const res = require("express/lib/response");
const SESSION_FILE_PATH = "../session1.json";
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
  sessionCfg = require(SESSION_FILE_PATH);
}
// console.log(MessageMedia);
// console.log(MessageTypes);
// console.log(MessageAck);
const client = new Client({
  puppeteer: { headless: false }, // Make headless true or remove to run browser in background
  // session: sessionCfg,
  clientId: "client-one",
  restartOnAuthFail: true,
  authStrategy: new LocalAuth({
    authStrategy: new LocalAuth({ clientId: "client-one" }),
  }),
});
client.initialize();

client.on("qr", (qr) => {
  // NOTE: This event will not be fired if a session is specified.
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true }); // Add this line
  app.get("/getqr", (req, res, next) => {
    res.send({ qr });
  });
});

client.on("authenticated", (session) => {
  console.log("AUTHENTICATED", session);
});

client.on("auth_failure", (msg) => {
  // Fired if session restore was unsuccessfull
  console.error("AUTHENTICATION FAILURE", msg);
});

client.on("ready", () => {
  console.log("READY");
  // schedule.scheduleJob("*/5 * * * * *", () => {
  //   sendMsg();
  // });
});

client.on("message", async (msg) => {
  let { from } = msg;
  let chat = await msg.getChat();
  const start = ["שלום", "היי", "מה קורה"];

  // IF it`s not group

  if (!chat.isGroup) {
    // Start Msg

    const contact = await msg.getContact();
    if (
      msg.body.includes("שלום") ||
      msg.body.includes("היי") ||
      msg.body.includes("הי") ||
      msg.body.includes("מה נשמע") ||
      msg.body.includes("עזרה") ||
      msg.body.includes("מה קורה")
    ) {
      client.sendMessage(
        from,
        `
      *${contact.pushname} היי נעים מאוד*
      רוצה לדבר עם הבוט החכם שלנו
      השב: התחל
      `
      );
    }

    //If User send MSG - התחל
    else if (msg.body == "התחל") {
      const contact = await msg.getContact();
      let media = await MessageMedia.fromFilePath("./images/logo.png");

      await client.sendMessage(from, media);
      client.sendMessage(
        from,
        `
*ברוך הבא לבוט החכם שלנו*
*לשעות הפעילות*
השב/י: שעות פעילות
*לרכישת מנוי*
השב: אני מעוניינ/ת במנוי
*משהו אחר*
השב/י: משהו אחר
*לכתובת המקום*
השב/י:מיקום

אנא הקשיבו להוראות
בתודה צוות הדיגיטל (●'◡'●)
      `
      );
    }

    //If send req for hours
    else if (msg.body.includes("שעות")) {
      console.log(msg.body);
      const media = await MessageMedia.fromFilePath("./images/imgTime.png");
      client.sendMessage(
        from,
        `
*שעות הפעילות*
נשמח לראותך בין לקוחותינו
    `
      );
      client.sendMessage(from, media);
    }

    //If send req for signup
    else if (msg.body.includes("במנוי") || msg.body.includes("מנוי")) {
      let media = await MessageMedia.fromFilePath("./images/logo.png");

      client.sendMessage(
        from,
        `
   נשמח לראותך בין לקוחותינו
   השאר בבקשה 
   *מספר טלפון* 
   *שם מלא*
   *סוג מנוי*
   נציג מטעמינו 
   יחזור אלייך
   בהקדם האפשרי 
       `
      );
      client.sendMessage(from, media);
    }

    //If send req for something else
    else if (msg.body.includes("אחר")) {
      client.sendMessage(
        from,
        `
*היי*
אני מבין שאתה מתעניין
במשהו אחר תוכל לפרט יותר?
נעביר את פנייתך לנציגים שלנו    
 `
      );
    }     else if (msg.body.includes("להרשם לשיעור") || 
                   msg.body.includes('שיעורים') || 
                   msg.body.includes('שיעור')) {
      client.sendMessage(
        from,
        `
*היי*
ההרשמה לשיעורים היא באמצעות 
האפליקציה שלנו תוכלו להוריד בקישור הבא
Google Play
https://play.google.com/store/apps/details?id=il.co.offline.mattiapp
AppStore
https://apps.apple.com/us/app/id1450195039    
 `
      );
    }    else if (msg.body.includes('מיקום') || 
                  msg.body.includes('כתובת') 
                  ) {
          client.sendMessage(
          from,
`
*היי*
הכתובות שלנו הן
*רמות א*   
יעקב אלעזר 16
*רמות ב*
אסירי ציון 3
נשמח לראות אותך
תודה צוות הדיגיטל
`
);
} 
  }
});

function sendMsg(from) {
  axios({
    method: "post",
    url: "http://localhost:3900/msgs/sendMessageNumber",
    data: {
      number: from,
    },
  });
}

module.exports = client;
//   let button = new Buttons(
//   "hey",
//   [{ body: "btn1" }, { body: "btn2" }],
//   "hello",
//   "by by"
// );
// client.on("message", async (msg) => {
//   if (msg.body == "היי") {
//     const { from } = msg;
//     const chat = await msg.getChat();

//     let someEmbed = new WwebjsSender.MessageEmbed()
//       .setTitle(`1️⃣ | What is your name?`)
//       .setDescription(`Please, type your name.`)
//       .setFooter(`Question!`)
//       .setTimestamp()
//       .sizeEmbed(24);

//     let AnotherEmbed = new WwebjsSender.MessageEmbed()
//       .setTitle(`2️⃣ | What is your age?`)
//       .setDescription(`Please, type your age.`)
//       .setFooter(`Question!`)
//       .setTimestamp()
//       .sizeEmbed(24);
//     let AnotherEmbed1 = new WwebjsSender.MessageEmbed()
//       .setTitle(`2️⃣ | Thank You`)
//       .setDescription(`Please, type your age.`)
//       .setFooter(`Question!`)
//       .setTimestamp()
//       .sizeEmbed(24);

//     let button1 = new WwebjsSender.MessageButton()
//       .setCustomId("confirm")
//       .setLabel("✅");
//     const collect = new WwebjsSender.Collector({
//       client: client,
//       chat: chat,
//       number: from,
//       max: [20, 3],
//       question: ["What is your name?", "What is your age?"],
//       embed: [someEmbed, AnotherEmbed],
//       button: [button1],
//       time: 30000,
//     });

//     collect.on("message", async (msg) => {
//       let body = msg.body;
//       console.log(body);
//     });

//     await collect.initialize();

//     // let resultMessageQuestion = await collect.messageQuestionCollcetor();

//     let resultEmbedQuestion = await collect.embedQuestionCollector();
//     WwebjsSender.send({
//       client: client,
//       button: [button1],
//       embed: AnotherEmbed1,
//       number: from,
//     });
//     console.log(resultEmbedQuestion);
//   }
// });

// client.on("message", async (msg) => {
//   const chat = await msg.getChat();
//   const contact = await msg.getContact();
//   const { from } = msg;

//   console.log(from);
//   if (msg.body === "היי") {
//     // await chat.sendMessage(`${contact.pushname} שלום `, {
//     //   mentions: [contact],
//     //   Buttons: ["dsa"],
//     // });
//     try {
//       sendMsg(from);
//     } catch (err) {
//       console.log(err);
//     }
//   }
// });

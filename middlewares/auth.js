/** @format */

const jwt = require("jsonwebtoken");
const config = require("config");

//-------------------------------{authenticate user middleware}-----------------------
function auth(req, res, next) {
  //validate user`s input
  const token = req.header("x-auth-token");
  if (!token) {
    res.status(401).send("Access denied No token provided");
    return;
  }

  //validate system
  try {
    const payload = jwt.verify(token, config.get("jwtKey"));
    req.user = payload;
    next();
  } catch (err) {
    console.log(err);
    res.status(400).send("Invalid token");
  }
  //process
  //respond
}
//-------------------------------{authenticate user middleware}-----------------------

module.exports = auth;

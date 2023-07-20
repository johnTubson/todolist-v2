require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const mongoose = require("mongoose");



async function dbConnection () {
  const conn = await mongoose.createConnection(process.env.MONGO_SESSION_STORE_URL).asPromise();
  return conn;
}

const mongoInstance = dbConnection().then((connection) => connection.getClient());


const sessionStore = function store(databaseInstance) {
  return MongoStore.create({
    clientPromise: databaseInstance,
    ttl: 3 * 24 * 60 * 60, // expires in 2 days
    touchAfter: 24 * 60 * 60, // If no explicit change in session data, update on user refresh or revisit after 24 hours
    crypto: {
      secret: process.env.MONGO_STORE_SECRET,
    },
    collectionName: "sessions",
  });
};


module.exports = function (app) {
  return session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: app.get("env") === "production" ? { secure: true } : {},
    store: sessionStore(mongoInstance),
  });
}










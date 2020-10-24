const express = require("express");
const mongoose = require("mongoose");

require("dotenv").config();

const URI = process.env.MONGO_URI || "";

const usersRouter = require("../users/user.routes");

const PORT = process.env.PORT || 3000;

//

class Server {
  constructor() {
    this.server = null;
  }
  async start() {
    this.initServer();
    this.initMiddlewares();
    this.initRoutes();
    await this.initDb();
    this.initErrorHandler();
    this.startListening();
  }
  initServer() {
    this.server = express();
  }
  initMiddlewares() {
    this.server.use(express.json());
  }
  initRoutes() {
    this.server.use("/", usersRouter);
  }
  async initDb() {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
    try {
      await mongoose.connect(URI, options);
    } catch (err) {
      console.log("ERROR! DB CONNECTED UNSUCCESFULLY!");
      process.exit(1);
    }
    console.log("DB CONNECTED SUCCESFULLY");
  }
  initErrorHandler() {}
  startListening() {
    this.server.listen(PORT, () =>
      console.log(`Server was started on PORT: ${PORT} using MongoDB: ${URI}`)
    );
  }
}

module.exports = Server;

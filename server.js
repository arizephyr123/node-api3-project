const express = require('express');
const helmet = require('helmet');

const userRouter = require("./users/userRouter.js");

const server = express();

//middleware
server.use(helmet());
server.use(express.json());
server.use(logger);

// endpoints
//server.use(".api/users")

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl} at ${Date.now()}`);
  next();
}

module.exports = server;

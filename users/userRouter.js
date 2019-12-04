const express = require("express");

const userDb = require("./userDb");
const postDb = require("../posts/postDb");

const router = express.Router();

router.post("/", (req, res) => {
  userDb.insert(req.body)
  .then(response => {
    res.status(201).json(response);
  })
  .catch(err => {
    console.log("Delete User Error:", err);
    res.status(500).json({errorMessage: "There was a problem with the database. please try adding again later." });
  });
});

router.post("/:id/posts", validateUserId, (req, res) => {
  // do your magic!
});

router.get("/", (req, res) => {
  userDb
    .get()
    .then(response => {
      console.log(response);
      res.status(200).json(response);
    })
    .catch(err => {});
});

router.get("/:id", validateUserId, (req, res) => {
  const id = req.user.id;
  userDb
    .getById(id)
    .then(response => {
      console.log("GET /posts getById", id, response);
      res.status(200).json(response);
    })
    .catch(err => {
      console.log("GET /posts getById error", err);
      res
        .status(500)
        .json({
          error: "There was an error while getting user from the database"
        });
    });
});

router.get("/:id/posts", validateUserId, (req, res) => {
  // do your magic!
});

router.delete("/:id", validateUserId, (req, res) => {
  // do your magic!
});

router.put("/:id", validateUserId, (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  //see if user exists
  userDb
    .getById(id)
    .then(response => {
      console.log("validateUserId response", response);
      if (response === undefined) {
        res.status(400).json({ message: "invalid user id" });
      } else {
        req.user = response;
        next();
      }
    })
    .catch(err => {
      res
        .status(500)
        .json({
          message:
            "Something went wrong, please try again later.- validateUserId"
        });
    });
}

function validateUser(req, res, next) {
  
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;

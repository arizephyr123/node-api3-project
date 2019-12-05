const express = require("express");

const userDb = require("./userDb");
const postDb = require("../posts/postDb");

const router = express.Router();

// ✅
router.post("/", validateUser, (req, res) => {
  userDb
    .insert(req.body)
    .then(response => {
      res.status(201).json(response);
    })
    .catch(err => {
      console.log("POST to / error:", err);
      res.status(500).json({
        errorMessage:
          "There was a problem with the database. Please try adding again later."
      });
    });
});

//✅
router.post("/:id/posts", validateUserId, validatePost, (req, res) => {
  const userId = req.params.id;
  const { id, text } = req.body;
  postObj = { id: id, text: text, user_id: userId };
  //console.log("POST to /:id/posts", postObj);
  postDb
    .insert(postObj)
    .then(response => {
      res.status(200).json({
        message: `Success Adding Post. /n post number ${response.id}: ${response.text}`
      });
    })
    .catch(err => {
      console.log("POST to /:id/posts error", err);
      res.status(500).json({
        errorMessage: "There was an error with the database."
      });
    });
});

//✅
router.get("/", (req, res) => {
  userDb
    .get()
    .then(response => {
      //console.log("GET to / response", response);
      res.status(200).json(response);
    })
    .catch(err => {
      console.log("GET to / error", err);
      res.status(500).json({
        errorMessage: "There was an error with the database."
      });
    });
});

//✅
router.get("/:id", validateUserId, (req, res) => {
  const id = req.user.id;
  userDb
    .getById(id)
    .then(response => {
      //console.log("GET /:id getById", id, response);
      res.status(200).json(response);
    })
    .catch(err => {
      console.log("GET /:id getById error", err);
      res.status(500).json({
        errorMessage: "There was an error getting this user from the database"
      });
    });
});

//✅
router.get("/:id/posts", validateUserId, (req, res) => {
  const id = req.params.id;
  userDb
    .getUserPosts(id)
    .then(response => {
      if (response[0]) {
        res.status(200).json(response);
      } else {
        res.status(200).json({ message: "No Posts for this user" });
      }
    })
    .catch(err => {
      console.log("/:id/posts error", err);
      res.status(500).json({
        errorMessage: "There was an error with the database."
      });
    });
});

//✅
router.delete("/:id", validateUserId, (req, res) => {
  const id = req.params.id;
  userDb
    .remove(id)
    .then(
      res
        .status(200)
        .json({ message: `User has been deleted from the database.` })
    )
    .catch(err => {
      console.log("DELETE to /:id error", err);
      res.status(500).json({
        errorMessage: "There was an error with the database."
      });
    });
});

//✅
router.put("/:id", validateUserId, validateUser, (req, res) => {
  const id = req.params.id;
  const changes = req.body;
  userDb
    .update(id, changes)
    .then(response => {
      res.status(200).json(changes);
    })
    .catch(err => {
      console.log("PUT to /:id error", err);
      res.status(500).json({
        errorMessage: "There was an error with the database."
      });
    });
});

//custom middleware
//✅
function validateUserId(req, res, next) {
  const id = req.params.id;
  //see if user exists
  userDb
    .getById(id)
    .then(response => {
      //console.log("validateUserId response", response);
      if (response === undefined) {
        res.status(404).json({ message: "invalid user id" });
      } else {
        req.user = response;
        next();
      }
    })
    .catch(err => {
      console.log("validateUserId getById error", id, err);
      res.status(500).json({
        errorMessage: "Something went wrong, please try again later."
      });
    });
}

//✅
function validateUser(req, res, next) {
  console.log("validateUser", req.body);
  //Object.keys method returns array of given obj
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    next();
  }
}

//
function validatePost(req, res, next) {
  if (Object.keys(req.body).length === 0) {
    res.status(400).json({ message: "missing post data" });
  } else if (req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    next();
  }
}

module.exports = router;

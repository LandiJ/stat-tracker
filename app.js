const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const models = require("./models");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const dbURL = "mongodb://localhost:27017/tracker";
const login = require("./routes/login");
const session = require("express-session");
const sessionConfig = require("./sessionConfig");

const port = process.envPORT || 7000;
const app = express();
const expressValidator = require("express-validator");
const mustacheExpress = require("mustache-express");

app.engine("mustache", mustacheExpress());
app.set("views", "./public");
app.set("view engine", "mustache");

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(session(sessionConfig));
app.use(expressValidator());

login(app);

var User = require("./models/User");
var activity;

mongoose.connect(dbURL).then(function(err, db) {
  if (err) {
    console.log("error");
  } else console.log("Connected to MONGOOSE DB");
});

app.get("/", function(req, res) {
  res.render("index");
});

app.post("/users", (req, res) => {
  let newUser = new User(req.body);
  newUser.save().then(savedUser => {
    res.send({ status: "success", record: savedUser });
  });
});

app.post("/add-stats/:activityid", function(req, res) {
  //   res.send("hello");
  User.findOne({ _id: req.session.userRequesting._id }).then(function(
    foundUser
  ) {
    for (var i = 0; i < foundUser.activities.length; i++) {
      if (foundUser.activities[i].id == req.params.activityid) {
        console.log(foundUser.activities[i].title);
        activity = foundUser.activities[i];
        res.render("addStats", { activity: activity });
      }
    }
  });
});

app.post("/stats", function(req, res) {
  User.findOne({ _id: req.session.userRequesting._id }).then(function(
    foundUser
  ) {
    for (var i = 0; i < foundUser.activities.length; i++) {
      if (foundUser.activities[i].id == activity.id) {
        var save = foundUser.activities[i].Info.push(req.body);
        foundUser.save().then(function(saved) {
          res.send(saved);
        });
      }
    }
  });
});

app.post("/activities/:userid", function(req, res) {
  User.findOne({ _id: req.session.userRequesting._id }).then(function(
    foundUser
  ) {
    var newActivity = foundUser.activities.push(req.body);
    foundUser.save().then(function(savedActivity) {
      res.send(savedActivity);
    });
  });
});
app.listen(port, function() {
  console.log("server is running on", port);
});

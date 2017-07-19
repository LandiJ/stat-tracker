const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const models = require("./models");
const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");
const dbURL = "mongodb://localhost:27017/tracker";
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

// login(app);

var Activity = require("./models/Activity");
var activity;
var activityInfo;

mongoose.connect(dbURL).then(function(err, db) {
  if (err) {
    console.log("error");
  } else console.log("Connected to MONGOOSE DB");
});

app.get("/", function(req, res) {
  res.render("profile");
});

app.post("/activities", (req, res) => {
  let newActivity = new Activity(req.body);
  newActivity.save().then(savedActivity => {
    res.redirect("/");
  });
});
app.get("/activities", function(req, res) {
  Activity.find().then(function(foundActivities) {
    console.log(req.session);
    res.send(foundActivities);
  });
});

app.get("/activities/:id", function(req, res) {
  Activity.find({
    _id: req.params.id
  }).then(function(foundActivity) {
    console.log(req.session);
    res.send(foundActivity);
  });
});

app.put("/activities/:id", function(req, res) {
  Activity.update({ _id: req.params.id }, { title: req.params.title });
});
app.delete("/activity/:id", function(req, res) {
  Activity.delete({ _id: req.params.id }).then(function(deletedActivity) {
    console.log(req.session);
    res.send("deleted activity");
  });
});

app.post("/activities/:id/stats", function(req, res) {
  Activity.update(
    {
      _id: req.params.id
    },
    { $push: { Info: { Date: req.body.Date, Stats: req.body.Stats } } },
    { upsert: true }
  ).then(function(updated) {
    console.log(req.session);
    res.send(updated);
  });
});

app.delete("/stats/:id/", function(req, res) {
  Activity.update(
    {
      _id: req.params.id,
      "Info.Date": req.body.Date
    },
    { $pull: { Info: { Date: req.body.Date } } }
  ).then(function(deletedActivity) {
    console.log(req.session);
    res.send(deletedActivity);
  });
});

app.listen(port, function() {
  console.log("server is running on", port);
});

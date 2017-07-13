const models = require("../models");
var User = require("../models/User");

function login(app) {
  app.get("/in", function(req, res) {
    res.render("profile", {
      user: req.session.userRequesting,
      activities: req.session.userRequesting.activities
    });
  });

  app.post("/login", function(req, res) {
    if (!req.body || !req.body.password || !req.body.name) {
      res.redirect("/login");
    }

    var userRequesting = req.body;
    var userIs;

    User.find().then(function(foundUsers) {
      foundUsers.forEach(function(item) {
        if (item.name === userRequesting.name) {
          userIs = item;
        }
      });

      if (!userIs) {
        return res.redirect("/login");
      }

      if (userRequesting.password === userIs.password) {
        req.session.userRequesting = userIs;
        return res.redirect("/in");
      } else {
        return res.redirect("/login");
      }
    });
  });
}
module.exports = login;

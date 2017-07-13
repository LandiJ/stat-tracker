var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  activities: [
    {
      title: {
        type: String,
        required: true,
        default: "none"
      },
      Info: [
        {
          Date: {
            type: String,
            required: true,
            default: "today"
          },
          Stats: {
            type: Number,
            required: true,
            default: 0
          }
        }
      ]
    }
  ]
});
var User = mongoose.model("User", userSchema);
module.exports = User;

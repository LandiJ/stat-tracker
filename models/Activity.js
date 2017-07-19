var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// var eventSchema = new Schema({
//   date: {
//     type: Date,
//     required: true
//   },
//   stat: {
//     type: Number,
//     required: true,
//     default: 1
//   }
// });

// var activitySchema = new Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   events: [eventSchema]
// });

var activitySchema = new Schema({
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
});
var Activity = mongoose.model("Activity", activitySchema);
module.exports = Activity;
// var Event = mongoose.model("Activity", eventSchema);
// module.exports = Event;

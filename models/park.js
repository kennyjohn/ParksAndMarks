var mongoose = require('mongoose');

// SCHEMA SETUP
var parkSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    address: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

module.exports = mongoose.model("Park", parkSchema);

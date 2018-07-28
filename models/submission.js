var mongoose = require('mongoose');

// SCHEMA SETUP
// PARK SUBMISSION SCHEMA
var submissionSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    }
});

module.exports = mongoose.model("Submission", submissionSchema);

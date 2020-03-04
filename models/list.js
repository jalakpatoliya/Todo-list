const mongoose = require('mongoose');

// Company schema and model
var listSchema = new mongoose.Schema({
    name: String,
    creator: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String
    },
    tasks: [{
        description: String,
    }]
});

var List = mongoose.model("List", listSchema);

module.exports = List;

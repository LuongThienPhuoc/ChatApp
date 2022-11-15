const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        username: String,
        fullName: String,
        role: {
            type: String,
            default: "User"
        },
        chat: {

        },
        about: {
            type: String,
            default: "Need advice"
        },
        avatar: {
            type: String,
            default: '@src/assets/images/portrait/small/avatar.png'
        },
        status: {
            type: String,
            default: 'online'
        }
    },
);

module.exports = mongoose.model("user", userSchema);

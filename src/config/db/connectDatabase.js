require("dotenv").config();
const mongoose = require('mongoose');

async function connect(){
    try {
        await mongoose.connect(process.env.DB_CONNECT);
        console.log("Connect db secussfully");
    } catch (error) {
        console.log("Connect db failure");
    }

}

module.exports = {connect}
const mongoose = require('mongoose');
async function connect(){
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/sound_mp3');
        console.log("Connect db secussfully");
    } catch (error) {
        console.log("Connect db failure");
    }

}

module.exports = {connect}
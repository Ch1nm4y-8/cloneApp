const mongoose = require('mongoose');

const connectDB = async () =>{
    await mongoose.connect(
        "mongodb+srv://shadow:sqb_2s-T8D-ySE8@cnode.gmbj5.mongodb.net/devTinder"
    );
};

module.exports = {connectDB}
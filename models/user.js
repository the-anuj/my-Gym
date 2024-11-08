const mongoose = require('mongoose');
mongoose.connect(`mongodb://localhost:27017/gymUser`);

const userSchema = mongoose.Schema({
    name : String,
    email: String,
    contact: Number,
    age: Number,
    password: String,
});

module.exports = mongoose.model('user',userSchema);
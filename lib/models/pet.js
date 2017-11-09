const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({    
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['cat', 'dog', 'bird', 'fish', 'snake']
    },
    breed: String,
    catchPhrase: {
        type: String,
        maxlength: 140
    }  
});

module.exports = mongoose.model('Pet', schema);
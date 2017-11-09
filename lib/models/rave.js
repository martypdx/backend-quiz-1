const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({    
    pet: {
        type: Schema.Types.ObjectId,
        ref: 'Pet'
    },
    email: {
        type: String,
        required: true
    },
    comments: {
        type: String,
        maxlength: 250
    }  
});

module.exports = mongoose.model('Rave', schema);
const mongoose = require('mongoose')

const Schema = mongoose.Schema
const NoteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },    
    createdAt: {
        type: Date,
        default: Date.now()
    },    
    updatedAt: {
        type: Date,
    },    

})

module.exports = mongoose.model('Note', NoteSchema)
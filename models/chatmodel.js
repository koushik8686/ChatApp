const mongoose = require('mongoose')

const chatschema = mongoose.Schema({
    user:{
        name:String,
        id:String
    } , 
    expert :{
        name:String,
        id:String
    },
    messages:[{
        message:String,
        time:Date,
        sent_by:String,
        name:String
    }]
})

module.exports = mongoose.model('All_Chats',chatschema)
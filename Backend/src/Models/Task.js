const e = require('express');
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Title is required'], 
        trim : true, 
    },
    description:{
        type:String,
        default:"",
        trim :true,
    }, 
    status:{
        type:String, 
        enum:['pending','in-progress','completed'],
        default:'pending',      
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},{timestamps: true});

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;
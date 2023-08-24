const mongoose = require('mongoose');


const blogSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:[true,'UserID is required']
    },
    thumbnail:{
        type:String,
        default:''
    },
    tags:{
        type:Array,
        required:[true,'type required']
    },
    privacy:{
        type:String,
        required:[true,'blog privacy required']
    },
    blogdata:{
        type:String,
        required:[true,'Blog Data is required']
    },
    likes:{
        type:Array,
        default:[]
    },
    create:{
        type:Date,
        default:new Date().getTime()
    }
});


const blogModel = mongoose.models.blogs || mongoose.model('blogs',blogSchema);
module.exports = blogModel;
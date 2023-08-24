const mongoose = require("mongoose")

const ConnectDB=async(req,res,next)=>{
    mongoose.connect(process.env.MONGODB_URL).then(res=>{
        next();
    }).catch(err=>{
        return res.status(500).json({
            success:false,
            error:true,
            message:'Database connection error'
        });
    });
}



module.exports = ConnectDB;
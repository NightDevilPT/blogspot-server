const dotenv = require('dotenv');
const express = require("express");
const userRouter = require('./router/userRouter');
const blogRouter = require('./router/blogRouter');
const ConnectDB = require('./middleware/ConnectDB');
const cors = require('cors');

// ------ Configuring Environment Variable File
dotenv.config();

// ------ Assigning Port
const PORT = process.env.PORT || 3500;

// ------ Initializing Server
const server = express();

// ------ Using common middleware
server.use(cors({
    origin:['http://localhost:3000','https://blogsphere-web-app.vercel.app']
}));

server.use(express.json({limit:"16mb",extended:true}));
server.use(express.urlencoded({extended:true,limit:"16mb",parameterLimit:50000}));
server.use(ConnectDB);


// ------ User Route
server.use('/user',userRouter);
// ------ Blog Route
server.use('/blog',blogRouter);


server.get('/',(req,res)=>{
    return res.status(200).json({
        success:true,
        error:false,
        message:'Welcome to BlogSpot Backend Server'
    })
})

// ------ Running server on Available Ports
server.listen(PORT,()=>{
    console.log(`Server running ${PORT}`);
})
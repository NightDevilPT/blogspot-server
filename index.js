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
    origin:['http://localhost:3000']
}));

server.use(express.json());
server.use(express.urlencoded({extended:true}));
server.use(ConnectDB);


// ------ User Route
server.use('/user',userRouter);
// ------ Blog Route
server.use('/blog',blogRouter);


// ------ Running server on Available Ports
server.listen(PORT,()=>{
    console.log(`Server running ${PORT}`);
})
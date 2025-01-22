require('dotenv').config();
const {connectDB} = require('./config/database');
const express = require('express');
const {User} = require('./models/User');
const cookieParser = require('cookie-parser');

const cors = require('cors');
const {authTokenCheck} = require('./middleware/auth');

const {authRouter} = require('./routes/authRouter')
const {profileRouter} = require('./routes/profileRouter');
const {requestRouter} = require('./routes/request');
const { userRouter } = require('./routes/user');
const {chatRouter} = require('./routes/chatRouter');

const {initializeSocket} = require('./utils/socket');

const app = express();
const port = 3000;

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter); 
app.use("/",userRouter);
app.use("/",chatRouter);

const http = require("http");
const server = http.createServer(app);
initializeSocket(server);

connectDB().then(()=>{
    console.log("Database connected Successfully...");
    
    server.listen(port, ()=>{
        console.log("Server listening on port "+port)
    })
}).catch(err=>{
    console.log("Could not connect to Database, Error: ",err);
})
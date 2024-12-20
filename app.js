const express = require("express");
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true  
}));



// import all routes
const errorMiddleWire = require('./middlewares/errors');
const auth = require('./routes/auth');
const user = require('./routes/user');
const siteSurvey = require('./routes/siteSurveyRoutes')


app.use('/api/v1/auth', auth);
app.use('/api/v1/user',user);
app.use('/api/v1/site-survey',siteSurvey);
app.use(errorMiddleWire)

app.get('test' , (req,res)=>{
    res.send("Hello World")
})


module.exports = app;

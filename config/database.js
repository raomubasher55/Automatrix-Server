const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config.env' });

// DB_LOCAL_URI = mongodb+srv://raomubasher5555:Rao3937!@cluster0.07tu9yq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0


const connectDatabase = ()=>{
    
    mongoose.connect(process.env.DB_LOCAL_URI).then((con)=>{
        console.log(`Mongo db database connected with ${con.connection.host}`);
    }) 
}

module.exports = connectDatabase; 
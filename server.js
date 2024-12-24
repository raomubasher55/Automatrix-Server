const dotenv = require('dotenv').config({ path: './config/config.env' });
const app = require('./app');
const connectDatabase = require('./config/database');

const port = process.env.PORT ; 
const env = process.env.NODE_ENV || 'development'; 
 
connectDatabase();  




// unhandled promise rejection eror
process.on('unhandledRejection', err =>{ 
  console.log(`Error : ${err.message}`)
  console.log("shutting down the server due to handled error");
  server.close(()=>{
      process.exit(1)
  })
})


// handle uncaught exceptions
process.on("uncaughtException", err=>{
  console.log(`Message : ${err.message}`)
  console.log("shutting down the server due to uncaughtException");
  process.exit(1)

}) 

 
 
app.listen(port, () => { 
  console.log(`Server is running on port ${port} in ${env} mode`);
}); 
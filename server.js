const dotenv = require('dotenv').config({ path: './config/config.env' });
const app = require('./app');
const http = require('http');
const socketIo = require('socket.io');
const connectDatabase = require('./config/database');
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.PORT ; 
const env = process.env.NODE_ENV || 'development'; 
 
connectDatabase();  



// Listen for connections
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for events from the client (if needed)
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});



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
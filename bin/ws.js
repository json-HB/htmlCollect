const server = require('http').createServer();
const io = require('socket.io')(server);
io.on('connection', client => {
    console.log('connection')
  client.on('event', data => { 
      console.log(data)
  });
  client.on('disconnect', () => { 
      console.log('disconnect')
   });
});
server.listen(3004, () => {
    console.log('listen 3004')
});
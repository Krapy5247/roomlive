var io;
var roomlist = require('../models/roomlist');


module.exports = function(httpsServer) {

  io = require('socket.io').listen(httpsServer);

  const bot = 'Chat Bot';

  io.sockets.on('connection', async (socket) => {
    console.log("connection");

    const socketid = socket.id;
    

    socket.on("disconnect", () => {
      console.log("disconnect");
    });
    //加入房間
    socket.on('join', (roomid) =>{
      socket.join(roomid);
      //io.to(roomid).emit('roomopen')
      //console.log(roomid,'roomopen');
    });

    socket.on('roomMsg', (data) =>{
      //根據房間id傳輸給房內所有socket
      io.to(data.roomid).emit('roomMsg',data);
      //console.log(data);
    });

    //chat messages
    socket.on("message", (obj) => {
      //socketHander.storeMessages(obj);  //把訊息寫到DB
      //io.emit("message", obj);
      io.to(obj.roomid).emit("message",obj);
      console.log(obj,socketid);
    });

    

    //io.emit('history', history);
    
    //io.to(socketid).emit('history', history);

  });
  module.exports.get_socket = io;

}



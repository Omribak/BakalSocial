const io = require('socket.io')(8900, {
  cors: {
    origin: 'http://localhost:3000'
  }
});

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId === userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  // On connect

  console.log('user connected');

  //Get UserID and SocketId from the user
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  //Send and Get Message
  socket.on('sendMessage', ({ senderId, receiverId, text, profilePicture }) => {
    console.log(profilePicture);
    const user = getUser(receiverId);
    if (user) {
      io.to(user.socketId).emit('getMessage', {
        senderId,
        text,
        profilePicture
      });
    }
  });

  //On Disconnect
  socket.on('disconnect', () => {
    console.log('user disconnected');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});

import io from 'socket.io-client';

const socket = io.connect('http://47.98.227.225:8091/socket.io/');

function subscribeToLog(cb) {
  socket.on('log:log', log => cb(log, null));
  socket.emit('log:subscribe', "log subscriber");
}

export { subscribeToLog};

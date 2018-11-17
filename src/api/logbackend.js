import io from 'socket.io-client';
import config from '../config';

const socket = io.connect(config.server);

function subscribeToLog(cb) {
  socket.on('log:log', log => cb(log, null));
  socket.emit('log:subscribe', "log subscriber");
}

export { subscribeToLog};

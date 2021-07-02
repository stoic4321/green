import app from './server';
import ioHandler from './server/socket';
import { Server } from 'http';
import SocketIO from 'socket.io'

const port = process.env.PORT || 3000

let server;
let currentApp;
let io;

const stop = (cb) => {
  if(!server){ return cb()}
  console.log('stopping the server')
  currentApp = null
  // we use io.close rather than server.close because
  // server.close will wait for all sockets to disconnect
  // whereas io.close forcefully closes
  io.close( err => {
    if(err){ console.error(err.message) }
    server = null
    io = null
    return cb()
  })
}

const start = ( newApp, newIoHandler ) => {
  console.log('starting the server')
  server = Server(newApp);
  currentApp = newApp;
  io = SocketIO(server)
  newIoHandler(io)
  server.listen( port, error => {
      if (error) { throw error }
      console.log(`🚀 started on ${port}`);
  })
}

const restart = ( newApp, newIoHandler ) => stop( () => {
  console.log('server stopped')
  start(newApp, newIoHandler)
})

if (module.hot) {
  console.log('✅  Server-side HMR Enabled!');

  module.hot.accept(['./server','./server/socket'], () => {
    console.log('🔁  HMR Reloading...');
    const newApp = require('./server').default;
    const newIoHandler = require('./server/socket').default;
    restart( newApp, newIoHandler )
  });
}

start(app, ioHandler)

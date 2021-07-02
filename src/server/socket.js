import logger from './util/logger'
import { dirOpen } from './services/dirOpen'
import { addToFile } from './services/addToFile'
import path from 'path'

const genRelayMsgFn = (socket,io) => (verb) => {
  socket.on(verb, (msg) => {
    // logger.debug(`relayMsg().emit.${verb}( ${JSON.stringify(msg,null,2)} )`)
    io.emit(verb, msg)
  })
}

export default (io) => {
  let userIds = 0
  const homedir = require('os').homedir()
  logger.info('🚀 socket')
  io.on('connection', function (socket) {
    const userId = userIds++
    logger.debug(`user ${userId} connected`)
    const relayMsg = genRelayMsgFn(socket,io)
    relayMsg('ev')
    relayMsg('cmd')
    relayMsg('lesson')
    relayMsg('lessons')
    relayMsg('step')
    relayMsg('steps')
    relayMsg('tour')
    relayMsg('tours')
    relayMsg('mode')
    relayMsg('showResultsFolder')
    socket.on('showResultsFolder',()=>{
      const tpath = path.join(homedir,'Lesson_Test_Results')
      logger.debug(`dirOpen( ${tpath} )`)
      dirOpen(tpath)
    })
    socket.on('logLesson', ({fname,txt})=>{
      // logger.debug(`logLesson( ${fname} )`)
      // logger.debug(`logLesson( ${txt} )`)
      addToFile(fname, txt)
    })
    socket.on('logStep', ({fname,txt})=>{
      // logger.debug(`logStep( ${fname} )`)
      // logger.debug(`logStep( ${txt} )`)
      addToFile(fname, txt)
    })
  })
}

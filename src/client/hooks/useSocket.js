import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

let queuedMsgs = []
let topSocket = null

const emitQueuedMsgs = (idd) => {
  if (topSocket) {
    queuedMsgs.forEach(({dest,msg,id},i)=>{
      console.log(`>>>>/%c${idd+''}%c\\.emit.%c${dest}()%c ${(i>0)?i:''}%o`, 'color:yellow', 'color:#ccc','background:yellow;color:black','',msg)
      topSocket.emit(dest, msg, id)
    })
    queuedMsgs = []
  } else {
    console.log('WAITING MSGS x'+queuedMsgs.length, queuedMsgs)
    setTimeout(()=>emitQueuedMsgs(idd), 1000)
  }
}
const emit = (dest, msg, id='_') => {
  queuedMsgs.push( {dest,msg,id} )
  if (!topSocket) console.log('ERROR A: no topSocket in useSocket().emit() for dest:'+dest+' msg:', msg)
  emitQueuedMsgs(id)
  //socket.emit(dest, msg)
}

export const useSocket = () => {
  const [socket, setSocket] = useState(null)
  // const hostUrl = window.location.host

  useEffect(() => {
    // setTimeout(() =>
      setSocket(io('/'))
    // ,4000)
  }, [])

  useEffect(() => {
    if (!socket) return
    socket.on('connect', () => {
      // console.log('useSocket connected')
    })

    socket.on('disconnect', () => {
      // console.log('useSocket disconnected')
    })

    socket.on('connect_error', () => {
      console.error('connect error')
      return socket.disconnect()
    })
    topSocket = socket

    return () => {
      socket.disconnect()
    }
  }, [socket])

  const isConnected = socket ? true : false

  const genEmitFn = (dest,id) => (msg,force) => {
    if ((msg!=null)||force) {
      console.log(`%cdest:%c${dest}, %cid:%c${id} %cmsg:%c${JSON.stringify(msg).slice(0,150)}`, 'color:lime', 'color:cyan', 'color:lime', 'color:cyan', 'color:lime', 'color:cyan')
      emit(dest, msg, id)
    }
    else console.log('%c!!!!! null msg'+JSON.stringify({dest, msg, id}), 'color:pink')
  }
  const sendEventMessage = genEmitFn('event')
  const sendCmdMessage   = genEmitFn('cmd')

  return { emit, genEmitFn, sendCmdMessage, sendEventMessage, isConnected, socket }
}
//-----------||||||||||||||||||------------------------------------
export const useSocketCallbacks = ( {id, ...callbackFnObj} ) => {
  const { genEmitFn, isConnected, socket } = useSocket()
  let emit = {}
  const all = (fn) => Object.entries( callbackFnObj ).forEach( fn )
  all( ([key, cbFn])=> emit[key] = genEmitFn(key) ) // fake emitters in case the socket is not ready
  useEffect(() => {
    if (socket) {
      let lg = []
      all( ([key, cbFn])=>{
        socket.on(key, (msg)=>{
          // console.log(`/${id}\\.on.${key}(${(cbFn)?'✓':'✘'})      msg:`,msg)
          cbFn && cbFn(msg)
        })
        emit[key] = genEmitFn(key,id+'')
        lg.push(key)
      })
      console.log('%cSOCKETS[%c%s%c] %o','color:cyan','color:lime',id,'color:cyan',lg)
    }
  }, [socket])
  return [emit]
} // Usage:
//const [cmds, setCnds] = useState([])
//const addCmd = (msg) => setCmds( (cmds) => [...cmds, msg] )
//const [ev, setEv] = useState('')
//const [emit] = useSocketCallbacks(
//     { cmd: addCmd, ev: setEv, id:'CommanderMole' }
//  )


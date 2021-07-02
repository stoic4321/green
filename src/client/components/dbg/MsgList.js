import {DbgScroller} from './DbgScroller'
import { useSocketCallbacks } from '../../hooks/useSocket'
import {useList} from '../../hooks/useList'

export const MsgList = ({socketKeys, stl, delay}) => {
  const [msgs, setMsgs,addMsg] = useList([])
  // const addMsg = (msg) => setMsgs((arr) => [...arr, msg])
  let cbFns = { id:'MsgList' }
  socketKeys.forEach((k)=> {
    const fn = (msg)=>addMsg(`&${k}\n${JSON.stringify(msg,null,2)}\n&${k}`)
    cbFns = {...cbFns, [k]:fn}// merge each callback function into the obj
  })
  const [emit] = useSocketCallbacks( cbFns )
  // const [emit] = useSocketCallbacks( { [socketKey]:addMsg, id:'MsgList' } )
  return (
    <DbgScroller {...{list:msgs, stl, delay, doClk:()=>{setMsgs([])}}} />
  )
}



import { MsgList } from '../components/dbg/MsgList'

export const DbgCmds = () => (<>
  <MsgList {...{
    stl:{color:'lime'},
    delay:1000,
    socketKeys:['cmd','lesson','steps','tours']
  }} />
</>)

export const DbgEvs  = () => (<>
  <MsgList {...{
    stl:{color:'yellow'},
    delay:1,
    socketKeys:['ev','step','tour','mode','showResultsFolder']
  }}  />
</>)
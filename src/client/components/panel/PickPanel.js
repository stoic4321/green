import { useState, useEffect, useRef } from 'react'
import { useSocketCallbacks } from '../../hooks/useSocket'
import { useIdx } from '../../hooks/useIdx'
import {ItemPicker} from '../item_picker/ItemPicker'
import './lessons.scss'

const NxtPrev = ({txt,clkFn}) => (
  <div onClick={()=>clkFn()} className="me-1 px-1 btn btn-sm p-0 btn-outline-primary">
    {txt}
  </div>
)
const log = (lbl,obj,col='yellow',n=200,col2='lime') => console.log('%c'+lbl+'%c'+JSON.stringify(obj).slice(0,n),'color:'+col2,'color:'+col)

// const DefaultPickPanelList = ({children}) => (<>{children}</>)
//--------------|||||||||--------------------------
export function PickPanel({ label, flavors, listFilter=((x)=>true), onPick, sockets=['x','xs'], CompItem, CompList, itemClz, listClz }) {
  // CompList = CompList ?? DefaultPickPanelList
  const [socketItem,socketList] = sockets
  const hasFlavor = (flav) => (flavors+',').includes(flav+',')

  const [mode,  setMode]  = useState(null)
  const [panel, setPanel] = useState({list:[{text:{title:label}}]})
  const [idx, setIdx, nextIdx, prevIdx] = useIdx( -1, panel?.list?.length ?? 0 )
  // const [item,    setItem ] = useState(null)

  const onSocketItem = (itm) => {
    // log(label+'.onSocketItem(', {idx:itm.idx, item:itm}, 'wheat', 200)
    setIdx(itm.idx) // AAAA
  }
  const onSocketList = (panel) => {
    panel = (panel.list) ? panel  : {list:panel}
    // log(label+'.onSocketList(', panel, 'yellow')
    setPanel(panel)
    if (hasFlavor('AutoFirst')) emit[socketItem]( panel?.list?.[0] ) // calls emit.tour()  or  emit.step()   or   similar
    // setIdx(0)// TODO: redundant to emit below plus AAAA above?
  }
  const onMode = (mde) => {
    // console.log(label,{mde})
    setMode(mde)
  }
  //-------------==================------------
  const [emit] = useSocketCallbacks({ id: label,
    [socketItem]: onSocketItem,       // <channel>:null makes a channel for emitting only (no callback function)
    [socketList]: onSocketList,
    mode:   onMode,  // know what lesson mode I'm in
    // lesson: onLesson, // get the whole lesson
  })
  // console.log('$$$$$$$ PICK_PANEL',label,(Object.entries(emit).map((k,v)=>(k+'').split(',')[0])))
  const isFirstRun = useRef(true);
  useEffect( ()=>{ // picking a tour via click OR via [<prev] / [next>] btns will trigger this effect & emit
    if (isFirstRun.current) {
      isFirstRun.current = false
      return
    }
    // console.log('PICKPANEL useEffect(idx)', label, {idx})
    const item = panel?.list?.[idx]
    if (item) {
      onPick(           item, idx)
      // emit[socketItem]( item ) // calls emit.tour(item)  or  emit.step(item)   or   similar
    }
  }, [idx])

  const pick = (item, i) => {
    setIdx(i)
    if (i==idx) onPick( item, i )
    // if (!hasFlavor('BlockItemEmit')) {
      emit[socketItem]( item )
    // }
  }
  // console.log('hasFlavor(anymode)',label,hasFlavor('AnyMode'))
  //----------------------------------------
  return ( 
    ((mode || hasFlavor('AnyMode')) && panel?.list)  
    ?
    <>
      <ItemPicker {...{ 
        label, 
        list:(panel.list||[]).filter(listFilter), 
        idx, 
        pick, 
        CompItem, 
        CompList, 
        itemClz, 
        listClz }} 
      />
    </>
    :
    <div className="faint">{`<${label}/> awaiting lesson launch`}</div>
  )
}
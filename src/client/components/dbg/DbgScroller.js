import { useEffect, useRef, useState } from 'react'

export const DbgScroller = ({list,doClk,stl,delay=100}) => {
  let clearBtnRef = useRef()
  const stl2 = {fontSize:8, color:'#2f2', padding:3, borderBottom:'solid 1px lime', ...stl}

  const [alarm,setAlarm] = useState(null)

  useEffect(() => {
    if (alarm) clearTimeout(alarm)
    const alm = setTimeout( ()=>{
        clearBtnRef.current?.scrollIntoView({ behavior: "smooth" })
    }, delay )
    setAlarm(alm)
  }, [list])

  return (
    <pre style={styles.dbgScroller}>
      {list.map((c,i)=>(
        <div style={stl2} key={'cmd_report_'+i}>
          {c}
        </div>
      ))}
      <button
        ref={clearBtnRef} 
        onClick={doClk} 
        style={{background:'none', transform:'scale(0.7)',...stl}} 
        className="btn btn-sm btn-outline-success m-0"
      >
        clear
      </button>
    </pre>
  )
}

const styles = {
  dbgScroller: {
    overflow: 'auto',
    background: '#000',
    height: '50%'
  }
}
import { useState, useEffect } from 'react'
import { useSocketCallbacks } from '../../hooks/useSocket'
import { useIdx } from '../../hooks/useIdx'
import {PickPanel} from '../panel/PickPanel'

const NxtPrev = ({txt,clkFn}) => (
  <div onClick={()=>clkFn()} className="me-1 px-1 btn btn-sm p-0 btn-outline-primary">
    {txt}
  </div>
)

export function Tours() {
  // const [tours, setTours] = useState([])
  // const [tourIdx, setTourIdx, nextTour, prevTour] = useIdx(0,tours.length)
  // const [mode,setMode] = useState(null)

  const onLesson = (lsn) => {
    // const ts = lsn.tours.map((t)=>({...t, text:t.tourText, tourText:undefined}))
    // console.log('TS:',ts)
    // setTours(ts)
    // setTours(lsn.panels.tours.list)
    // setTourIdx(0)
  }
  const [emit] = useSocketCallbacks({ id: 'Tours',
    tour: null,       // <channel>:null makes a channel for emitting only (no callback function)
    lesson: onLesson, // get my list of tours for the lesson
    mode:   setMode,  // know what lesson mode I'm in
  })

  // useEffect( ()=>{ // picking a tour or [<prev] / [next>] btns will trigger this emit
  //   if (tours[tourIdx]) emit.tour(tours[tourIdx])
  // }, [tourIdx])

  return ( (!mode) ?
    <div className="faint">{'<Tours/> awaiting lesson launch'}</div>
    :
    <div className='menu__overflow-box mt-4'>
    {/* <div className='border border-dark rounded my-4'> */}
      <ItemPicker {...{ label: 'Tours:',
          list: tours,
          pick: (tour, i) => setTourIdx(i),
          idx: tourIdx
        }}
      />
      <hr className="m-1"/>
      <div className="ms-3 mb-2">
        <NxtPrev txt="<" clkFn={prevTour} />
        <NxtPrev txt=">" clkFn={nextTour} />
      </div>
    </div>
  )
}
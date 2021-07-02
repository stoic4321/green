import { useState, useEffect, useRef } from 'react'
import { useSocketCallbacks } from '../../hooks/useSocket'
import { useList } from "../../hooks/useList"
import useFetch from '../../hooks/useFetch'
import { useIdx } from '../../hooks/useIdx'
import {dateFormat} from '../../helpers/dateFormat'
//-----------|||||||---------------------------------
export const Lessons = () => {
  useEffect( ()=>console.clear() , [])

  const [emit] = useSocketCallbacks({ id: 'Lessons',
    // checkLessonsFolder: (msg)=>{lessons = useFetch('/api/lessons')},
    lessons: null, // null means just for emitting (no callback function)
    lesson:  null, // TODO: remove this later
    mode: null,    // TODO: remove this later
  })

  let lessons = useFetch('/api/lessons')
  useEffect(() => {
    const lsns = lessons?.data
    if (lsns) {
      // console.log('LESSONS',lsns)
      emit.lessons(lsns.map( (x,i)=>({...x,idx:i}) ))
      // emit.lesson(lsns?.[1]) // TODO: remove this later
      // emit.mode('Learn') // TODO: remove this later
    }
  }, [lessons.data])
  return <div className="faint">{'<Lessons/> '+((lessons.data)?'Y':'N')}</div>
}

const adjustStepFnsByMode = {
  Test: ( (stp,i,lsn)=>{
    // console.log('adjustStepFnsByMode( ',{i,stp,lsn,i})

    // Lesson Overrides by mode
    let {waitSwap, ...lsnMerge} = lsn.overrideByMode?.Test
    lsnMerge  = JSON.parse(JSON.stringify(lsnMerge)) // deep copy

    // waitSwap
    const waitToSwapIn = waitSwap[stp.wait_for]   // if the awaited step has an entry in waitSwap, ...
    if (waitToSwapIn) stp.wait_for = waitToSwapIn // then use that to replace the step's wait_for value (like 'ui.next' becomes 'skip')

    // Step Overrides by mode
    let stepMerge = stp.overrideByMode?.Test || {}
    stepMerge = JSON.parse(JSON.stringify(stepMerge))
    console.log({lsnMerge,stepMerge})

    // Keep hierarchy prefix
    const prefix = stp?.text?.title?.replace(/\w.*$/g,'') || '' // keep just text before the letters like ' - '
    // console.log('PREFIX=',{prefix,title:stp?.text?.title})
    
    // merge
    stp = {...stp, text:{}, ...lsnMerge, ...stepMerge} // For Test, stomp step text to blank {}, then merge in lsn & stp hashes

    // ensure a title
    if (!stp?.text?.title) stp.text.title = `${prefix}Step ${i+1} ${(stp.wait_for=='skip')?' (info, skip)':''}` // still blank title? make one for them.

    
    return stp
  }),
  All: ( (stp,i,lsn)=>{
    // Ensure cameras and Highlights
    const base = stp.wait_for?.replace(/^\w+\./,'') // remove prefix and .
    if ( ! stp?.cameras )    stp.cameras    = base
    if ( ! stp?.highlights ) stp.highlights = base
    return stp
  })
}
//-----------|||||||||||-------------------------------
export const adjustSteps = (lsn) => {
  const {panels,mode} = lsn
  let   {steps:{list}} = panels
  const adjust1 = adjustStepFnsByMode[mode] || ((stp,i,lsn)=>stp)
  const adjust2 = adjustStepFnsByMode['All']
  // console.log('adjustSteps( LIST=',list)
  panels.steps.list = list.map( (stp,i) => {
    const stp2 = adjust1(stp, i,lsn)
    return       adjust2(stp2,i,lsn)
  } )
  // console.log('adjustedSteps[0]', adjustedSteps[0], `mode="${mode}"`)
  // console.log('------panels.steps',panels.steps)
  return panels.steps
}
//-----------||||||-------------------------------
export const Lesson = () => {

  const [title, setTitle] = useState('')
  const [currEv, setCurrEv] = useState('')
  const awaited = useRef('---')
  const steps   = useRef([])
  const stepIdx = useRef(0)
  const [mode,setMode] = useState(null)
  const fname = useRef(null)

  const checkEvMatchToAwaited = (ev) => {
    console.log('evMatchesWaited(ev)-->', ev==awaited.current, {ev, awaited:awaited.current})
    let logThis = steps.current.list[stepIdx.current]
    if (ev==awaited.current) {
      logThis = {userWas: '###Right###', ...logThis}
      console.log('STEPIDX CHG 1',{stepIdx: stepIdx.current, steps:steps.current})
      stepIdx.current += 1//(Math.min(stepIdx.current+1,steps.current.length-1))
      console.log('STEPIDX CHG 2',{stepIdx: stepIdx.current, steps:steps.current})
      emitA.step( steps.current.list[stepIdx.current] )
    } else {
      logThis = { userWas: '###Wrong###', badClick:ev, ...logThis}
    }
    logThis = (JSON.stringify(logThis, null, 2)+'\n\n')
      .replace('###Wrong###','<span style="color:red">Wrong</span>')
      .replace('###Right###','<span style="color:green">Right</span>')
    console.log('logStep()',fname, logThis)
    fname.current && emitA.logStep({fname:fname.current, txt:logThis})
  }

  //---step & ev socket channels---------------
  const onStep  = (stp) => {
    awaited.current = stp?.wait_for || '?'
    if (stp?.wait_for == 'skip') {
      setTimeout(()=>{
        emitA.ev('skip')
      },1000)
    }
  }
  const onSteps = (stps)=> {
    console.log('-------onSteps(', {stps})
    steps.current = stps
    stepIdx.current = 0
    setCurrEv('')
    // emit1.step( steps.current.list[0] )
  }
  const onEv    = (ev)  => {
    setCurrEv(ev)
    checkEvMatchToAwaited(ev)
  }
  const onMode  = (mde)  => {
    setMode(mde)
  }
  const [emitA] = useSocketCallbacks({ id: 'LessonA',
    steps: onSteps,
    step:  onStep,
    ev:    onEv,
    mode:  onMode,  // know what lesson mode I'm in
    tours: null,
    logStep: null,
    logLesson: null,
  })
  //---lesson socket channel---------------
  const onLesson = (lsn) => {
    const lsnTtl = lsn?.text?.title
    setTitle(lsnTtl)
    // console.log('LESSON',lsn)
    if (lsn.mode) {
      // console.log('LESSON',{lsn,'lsn.panels.tours':lsn.panels.tours})
      emitA.steps( adjustSteps( lsn )   )
      emitA.tours( lsn.panels.tours )
      const dt = dateFormat(new Date(),'yyyy-MM-dd_hh-mm-ss_Z')
      // console.log('=======DATE:', dt )
      fname.current = `${lsnTtl.replace(/[\s\:\/\\]/g,'_')}__${dt}.html`
      emitA.logLesson({fname: fname.current, txt:
        `<html><body><h2>${lsnTtl}</h2><br/>\n<pre>`
      })
    }
  }
  const [emitB] = useSocketCallbacks({ id: 'LessonB',
    lesson: onLesson,
    checkLessonsFolder: null,
  })
  //---------------------------------
  return ( null
    // (!mode) ?
    // <div className="faint">{'<Lesson/> awaiting lesson launch'}</div>
    // :
    // <pre className="m-2 border border-primary p-2" style={{fontSize:'70%', background:'#000', color:'#fff'}}>
    //   <div>{'<Lesson/> debug:'}</div>
    //   <code style={{color:'#f33'}}>{title}</code><br/>
    //   wait_for:
    //   <code style={{color:'#f33'}}>
    //     {' '+JSON.stringify(awaited.current)}
    //   </code><br/>
    //   last ev:
    //   <code style={{color:'#f33'}}>
    //     {' '+JSON.stringify(currEv)}
    //   </code>
    //   <button
    //     className="btn btn-outline-primary btn-sm d-block"
    //     onClick={()=>{ emitB.checkLessonsFolder() } }
    //   >
    //     Reload lessons
    //   </button>
    // </pre>
  )
}

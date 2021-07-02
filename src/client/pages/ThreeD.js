import { useState, useEffect } from 'react'
import { useSocketCallbacks } from '../hooks/useSocket'
import { BtnList } from '../components/shared/BtnList'
import {useScript} from '../hooks/useScript'

const unityEmit = (msg) => {
  setTimeout( ()=>{
    if(window.emitToUnity) window.emitToUnity(msg)
  }, 100)
}
const KeySee = ({hash,k,lbl}) => (
  (hash?.[k]) ? <p className='m-0' key={k}>{lbl||k}: <code>{JSON.stringify(hash?.[k])}</code></p> : null
)
//-------||||||---------------------------------
function Script({ src, code, async=true}) {
  useScript(src, code, async)
  return null
}
//----------------------||||||---------------------------------
export default function ThreeD({seeFake3d, rotateSome}) {
  const [waitedEvs, setWaitedEvs]   = useState(['3d.scanner','3d.usb_3','3d.bed','3d.powerSw'])
  const [waitedEv, setWaitedEv]   = useState('---')
  const [stepId, setStepId] = useState('---')
  const [tour, setTour] = useState()
  const [step, setStep] = useState()
  const [mode,setMode] = useState(null)
  const [lastVerb,setLastVerb] = useState('')

  const onStep   = (stp) => {
    setStepId(   stp?.id )
    setWaitedEv( stp?.wait_for )
    setStep( stp )
    unityEmit({ type:'step', message: stp })
    setLastVerb('step')
  }
  const onLesson = (lsn)  => setWaitedEvs( (lsn?.panels?.steps?.list && lsn.panels.steps.list.map(s=>s.wait_for).sort()) || ['missing'] )
  const onTour   = (tour) => {
    unityEmit({ type:'tour', message:tour })
    setTour(tour)
    setLastVerb('tour')
  }

  const [emit] = useSocketCallbacks({ id:'ThreeD',
    ev:   null,  // <channel>:null makes a channel for emitting only (no callback function)
    step:   onStep,
    lesson: onLesson,
    tour:   onTour,
    mode:   setMode,
  })
  if(typeof(window) !== 'undefined') {
    useEffect( ()=>{
      // setTimeout( ()=>{window.vuplex = {addEventListener:m=>console.log('VUPLEX.addEventListener=',m), postMessage:(m)=>console.log('VUPLEX.postMessage=',m)}})
      if (window?.vuplex) window.vuplex.addEventListener('message', (msg) => {
        emit.ev(msg?.data)
      })
      console.log('window.vuplex=',window.vuplex)
    }, [window.vuplex])
  }

  const stl = (rotateSome) ? {transform:'rotate3d(-1, 2, 0, -35deg) translate(-200px, 0px)', height: '50%'} : {}
  return ( (!mode) ?
    <div className="faint h-50">{'<ThreeD/> awaiting lesson launch'}</div>
    :
    <>
      <div className='border border-info rounded p-3 position-relative' style={{color: 'white',background:'transparent', opacity:'80%', ...stl}}>
        <header className='pane-header' style={{ textAlign: 'center' }}>
          <h2 className="text-info" >3D Placeholders</h2>
        </header>
        <BtnList list={waitedEvs} emit={emit} prefix="3d." highlightMatch={waitedEv} clz="btn-3d btn-sm my-4 d-block py-1 px-3"/>
        {(lastVerb=='step') && step?.cameras && <KeySee hash={step} k="cameras" lbl="Step camera view"/>}
        {(lastVerb=='tour') && tour?.cameras && <KeySee hash={tour} k="cameras" lbl="Tour camera view"/>}
        {/* <p className='m-0'>
          Step: <code>{stepId}</code>
        </p>
        <KeySee hash={lastTour} k="cameras" lbl="Tour cameras:"/>
        <KeySee hash={lastTour} k="text"  lbl="Tour text:"/>
        <p className='m-0'>Awaited 3D click Events:</p>
        <code style={{position:'absolute', bottom:0, right:10, color:'green'}}>socket[2]</code> */}
        <VuplexScript />
      </div>
      {(seeFake3d) && <div className="fake-3d"></div>}
    </>
  )
}

const VuplexScript = () =>(
  <Script code={`
  // SEND MESSAGEs TO UNITY
  window.emitToUnity = function(msg, callFromReadyListener=false) {
    console.log('VUPLEX ',{callFromReadyListener}, msg) // should log twice with callFromReadyListener false, then true
    if  (window.vuplex) {
      window.vuplex.postMessage(msg)
    }
    else {
      window.addEventListener('vuplexready',
        ()=>window.emitToUnity(msg,true)
      )
    }
  }
  window.emitToUnity({ type: 'greeting', message: 'TEST: Hello from JavaScript!' });

  // FAKE VUPLEX READY!!! TODO: REMOVE THIS
  // setTimeout(()=> document.body.dispatchEvent(new CustomEvent('vuplexready',{bubbles:true, detail:{}})), 8000)

  // GET MESSAGES FROM UNITY
  // if (window.vuplex) addMessageListener()
  // else window.addEventListener('vuplexready', ()=>window.addMessageListener())

  // function addMessageListener() {
  //   window.vuplex.addEventListener('message', function(event) {
  //     let json = event.data;
  //     // > JSON received: { "type": "greeting", "message": "Hello from C#!" }
  //     console.log('JSON received: ' + json);
          if (window?.vuplex?.emit?.ev) window.vuplex.emit.ev( '3d.' + json?.message )
  //   });
  // }

`}/>
)
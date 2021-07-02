import { useState } from 'react'
import { useSocketCallbacks } from '../hooks/useSocket'
import { BtnList } from '../components/shared/BtnList'

//----------------------||||||------------------------------------------------------
export default function DocBox({rotateSome}) {
  const [step, setStep] = useState({})
  const [waitedEvs, setWaitedEvs] = useState(['3d.---','3d.---','3d.---'])
  const onLesson = (lsn) => setWaitedEvs( (lsn?.panels?.steps?.list && lsn.panels.steps.list.map(s=>s.wait_for)) || ['missing'] )
  const [mode,setMode] = useState(null)

  const [emit] = useSocketCallbacks({ id:'DocBox',
    ev:     null,  // <channel>:null makes a channel for emitting only (no callback function)
    step:   setStep,
    lesson: onLesson,
    mode:   setMode,
  })
  const stl = (rotateSome) ? 
    { transform:'perspective(58em) rotateY(-42deg) translate(81px, 46px) scale(0.25)', 
      left: -172, top: -187 } 
    : 
    {}
  //------------------------------
  return ( (!mode) ?
    <div className="faint h-50" >{'<DocBox/> awaiting lesson launch'}</div>
    :
    <div className='docbox-page border border-dark rounded p-3 position-relative' style={stl}>
      <iframe 
        src="/captures//Docbox_patient-info.html"
        width="1920"
        height="1080"
      />
      <div style={{transform:'scale(6.0)', left:'119rem', position:'relative', top:'6rem'}}>
        <header className='position-absolute pane-header p-2' style={{ textAlign: 'center' }}>
          <h4 className="text-info my-5">EngageOnePro Placeholder</h4>
          <p>Step: <code>{step?.id || '___'}</code><br/></p>
          <p className="title p-1 mb-0 mt-1">
            {step?.text?.title}
          </p>
        </header>
        <div style={{zIndex: '100', position:'relative', left:100}}>
          <BtnList list={waitedEvs} emit={emit} prefix="db." highlightMatch={step?.wait_for}/>
        </div>
      </div>
      {/* <code style={{position:'absolute',bottom:0,right:10, color:'green'}}>socket[1]</code> */}
    </div>
  )
}

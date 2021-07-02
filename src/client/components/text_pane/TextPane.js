import { useState, useRef } from 'react'
import './TextPane.scss'
import { useSocketCallbacks } from '../../hooks/useSocket'
import {CloseBtn} from '../shared/CloseBtn'
import stethoscope from '../../../../public/icons/stethoscope.svg'
import {Idea} from '../images/Idea'
import {ArrowRightCircleFill} from 'react-bootstrap-icons'

//-----------||||||||-------------------------------
export const TextPane = () => {
  const step = useRef({})
  const [mode,setMode] = useState(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [, updateState] = React.useState()
  const forceUpdate = React.useCallback(() => updateState({}), []);

  const toggleMinimize = () => setIsMinimized(!isMinimized)
  const onStep = (stp)  => {step.current = stp; forceUpdate();}
  const onTour = (tour) => {
    const stp = step.current
    console.log('STEP TEXT', stp?.text)
    console.log('TOUR TEXT', tour?.text)
    let text = {...stp?.text, ...tour?.text}
    console.log('MERGED TEXT',text)
    step.current = ({text, wait_for:stp?.wait_for})
    forceUpdate()
  }

  const [emit] = useSocketCallbacks({ id:'TextPane',
    ev:   null,  // <channel>:null makes a channel for emitting only (no callback function)
    mode: setMode,
    step: onStep,
    tour: onTour,
  })
  // const stp = step.current
  //-----------------------------------
  return ( (!mode) ?
    <div className="faint h-50" >{'<TextPane/> awaiting lesson launch'}</div>
    :
    (step.current?.text) ? <Text {...{...(step.current), emit, toggleMinimize, isMinimized}} /> : null
  )
}

//-----------||||-------------------------------
export const Text = ({ text:{title, description, action}, wait_for, emit, toggleMinimize, isMinimized }) => (
  <div>

    {/* // * When Minimized */}
    <span
      className={`${isMinimized ? 'clickable': 'd-none'}`}
      style={{position: isMinimized?'absolute':null, bottom: isMinimized?'1rem':null, }}
      onClick={() => toggleMinimize()}>
      <PaneTitle {...{title, isMinimized, toggleMinimize}}/>
    </span>

    {/* // * When not Minimized */}
    <div className={`${isMinimized ? 'd-none':'d-block'} pane__transparent-wrapper`}>
      <div className='pane text-pane'>
        <div className='pane__overflow-row text-pane__overflow-row'>
          <PaneTitle {...{title, isMinimized, toggleMinimize}}/>
          <CloseBtn classes='text-pane__close_btn' doClick={()=>toggleMinimize()}/>
        </div>

        <div className='text-pane__description'>
          <span className='text-pane__idea m-3 text-light'>
            {/* <img className="text-light" src={idea} style={{width:35,height:37}}/> */}
            <Idea stl={{width:35,height:37,stroke:'white'}}/>
          </span>
          <span className=''>
            <p className='text-light px-2 py-1'>{description}</p>
            <p className='m-0 text-light px-2 py-1'><strong>{action}</strong></p>
          </span>
        </div>
        <div className='text-pane__next-row'>
        {(wait_for=='ui.next') &&
          <button
          className='btn btn-xl glowing text-uppercase'
          onClick={ (e)=>{ emit.ev('ui.next') } }
          >
            <span className='mx-3'>Next</span>
              <ArrowRightCircleFill style={{width: 30, height: 30}}/>
          </button>
        }
        </div>
        {/* <code style={{position:'absolute',bottom:0,right:10, color:'green'}}>socket[3]</code> */}
      </div>
    </div>
  </div>
)

const PaneTitle = ({ title, isMinimized }) => {
  return (
    <div className={`pane__title-bubble text-pane__title-bubble minimized`}>
      <div className='pane__title-icon text-pane__image-box'>
        <img src={stethoscope} />
      </div>
      <div className='pane__title-text text-pane__title'>
        <h4 className='m-0 py-3 px-5 text-uppercase'>
          {title}
          {(isMinimized) && 
            <strong className="ms-4 me-2">
              {' ⁞'}
            </strong>
          }
        </h4>
      </div>
    </div>
  )
}


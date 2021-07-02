import {useState, useEffect} from 'react'
import { Core } from '../../components/core/Core'
import {  useSocketCallbacks } from '../../hooks/useSocket'
import {CloseBtn} from '../../components/shared/CloseBtn'
import {PickPanel} from '../../components/panel/PickPanel'
import './menu.styles.scss'
const Sp = ({n=7}) => (<>{Array.from(Array(n)).map((_,i)=>( <span key={i}>&nbsp;</span> ))}</>)
//----------------------||||--------------------------------
export default function Menu() {

  
  const [lessons, setLessons] = useState([])
  const [lesson,   setLesson] = useState(null)
  const [lsnIdx,  setLsnIdx ] = useState(-1)
  const [mode,setMode]        = useState(null)
  const [isMinimized, setIsMinimized] = useState(false)
  const [seeInactive, setSeeInactive] = useState(false)

  const toggleMinimize = () => setIsMinimized(!isMinimized)
  const onLessons = (x) => {setLessons(x)}
  const onLesson  = (x) => {
    setLesson(x)
    setLsnIdx(x.idx)
  }
  //const onMode = (mde) => { mode.current = mde }
  //-------------==================---------------------
  const [emit] = useSocketCallbacks({ id: 'Menu',
    checkLessonsFolder: null, // <channel>:null makes a channel for emitting only (no callback function)
    lessons: onLessons,
    lesson:  onLesson,
    mode: setMode,
    showResultsFolder: null,
  })
  const launchLesson = (lsn,mde)=>{
    emit.mode(   mde )
    emit.lesson( {...lsn, mode:mde} )
  }
  const pickLesson = (lsn,i)=> {
    setLsnIdx(i)
    setLesson(lsn)
    console.log('pickLesson(',{mode,i})
    if (mode) emit.mode(null,true) // true forces a null to be sent. Normally falsy stuff is ignored
  }
  //--------------------------------
  return (
    <div className='h-100'>

      {/* //* When Minimized */}
      <div className={`${isMinimized ? 'd-block':'d-none'}`}>
        <MenuBtn toggleMinimize={toggleMinimize} isMinimized={isMinimized}/>
      </div>

      {/* //* When Not Minimized */}
      <div className={`${isMinimized ? 'd-none':'d-block h-100'}`}>
        <div className='pane__transparent-wrapper' >
          <div className='pane menu '>
            <MenuOverflowRow {...{mode, isMinimized, toggleMinimize}}/>
              {/* // * Lessons List */}
              <PickPanel key="LESSONS:"{...{
                label:  'LESSONS:',
                sockets: ['lesson','lessons'],
                listFilter: ( (x)=>(seeInactive || x.active) ),
                flavors:'AnyMode',
                onPick: (item,i)=>{ emit.mode(null,true) }
              }}/>
            <div className='menu__box-wrapper' >

              {/* // * Lesson Launch Box */}
              <div className='menu__full-box'>
                <h4>{lesson?.text?.title}</h4>
                {(!mode) &&
                  <>
                    <p>{lesson?.text?.description}</p>
                    {lesson?.modes &&
                      lesson.modes.split(',').map((mode) => (
                        <button
                        key={mode}
                        className='btn bt-sm btn-success mx-2 launch-btn'
                        onClick={() => launchLesson(lesson, mode)}>
                          {mode}
                        </button>
                    ))}
                  </>
                }
              </div>

              {/* // * STEPS Box */}
              <div className='menu__overflow-box mt-4'>
                <PickPanel {...{
                  label:  'STEPS:',
                  sockets: ['step','steps'],
                  flavors:'AutoFirst',
                  itemClz:'ps-4',
                  onPick: (item,idx)=>console.log('STEPS ONPICK',{item,idx}),//(x,i)=>setStepIdx(x.idx)
                }}/>
              </div>

              {/* // * TOURS Box */}
              <div className='menu__overflow-box mt-4'>
                <PickPanel key="TOURS:"{...{
                  label:  'TOURS:',
                  sockets: ['tour','tours'],
                  flavors:'nextprev',
                  itemClz:'ps-4',
                  onPick: (item,idx)=>console.log('TOURS ONPICK',{item,idx}),//(list,idx)=> (list?.[idx]) && emit.tour(list?.[idx])
                }}/>
              </div>
          </div>
          <Core />
          {/* <code style={{position:'absolute',bottom:0,right:10, color:'green'}}>socket[0]</code> */}
          </div>
          <Settings {...{emit, setSeeInactive}}/>
        </div>
      </div>
    </div>
  )
}
const Settings = ({emit,setSeeInactive})=> {
  const [seen,setSeen] =  useState(false)
  return (
    <div>
      <GearBtn doClick={()=>setSeen(!seen)}/>
      {seen && 
        <div className='pane__overflow-row menu__overflow-row'>
          <div className='menu__overflow-box menu__settings' >
            <CloseBtn classes='menu__close-btn menu__settings_close' doClick={() => setSeen(!seen)} />
            <h4>Settings</h4>
            <br/>
            <button className="item-picker__button px-4 border-white"
              onClick={()=>{console.log('FOLDER!!');emit.showResultsFolder('',true)}}
            >
              Show Test Results Folder
            </button>
            <button className="item-picker__button px-4 border-white"
              onClick={()=>{console.log('NON-ACTIVE!!');setSeeInactive(true)}}
            >
              Show Non-Active Lessons
            </button>
          </div>
        </div>
      }
    </div>
  )
}
const MenuOverflowRow = ({ mode, toggleMinimize }) => (
  <div className='pane__overflow-row menu__overflow-row'>
    <MenuBtn toggleMinimize={toggleMinimize} />
    <div className='pane__title-bubble'>
      <div className='pane__title-icon menu__image-box'>
        <AvatarSvg />
      </div>
      <div className='pane__title-text menu__title'>
        <h5 className='m-0 p-3 text-uppercase'>{mode || <Sp n={12}/>}</h5>
      </div>
    </div>
    <CloseBtn classes='menu__close-btn' doClick={() => toggleMinimize()} />
  </div>
)

const MenuBtn = ({ toggleMinimize, isMinimized }) => {
  return (
    <button className={`menu__hamburger-btn ${isMinimized ? 'minimized' : ''}`} onClick={() => toggleMinimize()}>
      <HamburgerSvg />
      MENU
    </button>
  );
}

const HamburgerSvg = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='32'
    height='32'
    fill='currentColor'
    className='bi bi-list'
    viewBox='0 0 16 16'>
    <path
      fillRule='evenodd'
      d='M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z'
    />
  </svg>
)

const AvatarSvg = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='24'
    height='24'
    fill='currentColor'
    className='bi bi-person'
    viewBox='0 0 16 16'>
    <path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z' />
  </svg>
)
export const GearBtn = ({classes='', doClick}) => (
  <button className={`pane__close-btn up-left grow ${classes}`} onClick={(e)=>doClick(e)}>
    <svg id="Layer_1" style={{fill:'white',enableBackground:'new 0 0 512 512'}} version="1.1" viewBox="0 0 512 512">
      <path d="M424.5,216.5h-15.2c-12.4,0-22.8-10.7-22.8-23.4c0-6.4,2.7-12.2,7.5-16.5l9.8-9.6c9.7-9.6,9.7-25.3,0-34.9l-22.3-22.1  c-4.4-4.4-10.9-7-17.5-7c-6.6,0-13,2.6-17.5,7l-9.4,9.4c-4.5,5-10.5,7.7-17,7.7c-12.8,0-23.5-10.4-23.5-22.7V89.1  c0-13.5-10.9-25.1-24.5-25.1h-30.4c-13.6,0-24.4,11.5-24.4,25.1v15.2c0,12.3-10.7,22.7-23.5,22.7c-6.4,0-12.3-2.7-16.6-7.4l-9.7-9.6  c-4.4-4.5-10.9-7-17.5-7s-13,2.6-17.5,7L110,132c-9.6,9.6-9.6,25.3,0,34.8l9.4,9.4c5,4.5,7.8,10.5,7.8,16.9  c0,12.8-10.4,23.4-22.8,23.4H89.2c-13.7,0-25.2,10.7-25.2,24.3V256v15.2c0,13.5,11.5,24.3,25.2,24.3h15.2  c12.4,0,22.8,10.7,22.8,23.4c0,6.4-2.8,12.4-7.8,16.9l-9.4,9.3c-9.6,9.6-9.6,25.3,0,34.8l22.3,22.2c4.4,4.5,10.9,7,17.5,7  c6.6,0,13-2.6,17.5-7l9.7-9.6c4.2-4.7,10.2-7.4,16.6-7.4c12.8,0,23.5,10.4,23.5,22.7v15.2c0,13.5,10.8,25.1,24.5,25.1h30.4  c13.6,0,24.4-11.5,24.4-25.1v-15.2c0-12.3,10.7-22.7,23.5-22.7c6.4,0,12.4,2.8,17,7.7l9.4,9.4c4.5,4.4,10.9,7,17.5,7  c6.6,0,13-2.6,17.5-7l22.3-22.2c9.6-9.6,9.6-25.3,0-34.9l-9.8-9.6c-4.8-4.3-7.5-10.2-7.5-16.5c0-12.8,10.4-23.4,22.8-23.4h15.2  c13.6,0,23.3-10.7,23.3-24.3V256v-15.2C447.8,227.2,438.1,216.5,424.5,216.5z M336.8,256L336.8,256c0,44.1-35.7,80-80,80  c-44.3,0-80-35.9-80-80l0,0l0,0c0-44.1,35.7-80,80-80C301.1,176,336.8,211.9,336.8,256L336.8,256z"/>
    </svg>
  </button>
)
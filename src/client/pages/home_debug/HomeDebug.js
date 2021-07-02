import React from 'react'
import {useEffect } from 'react'
import DocBox from '../DocBox'
import Menu from '../menu/Menu'
import Text from '../Text'
import ThreeD from '../ThreeD'
import { DbgCmds, DbgEvs } from '../DbgMsgs'
import './home_debug.styes.scss'

function Home() {
  useEffect(()=>{
    let els = document.querySelectorAll('html, body')
    els.forEach(el=>{
      el.classList.add('scale-1x')
    })
  },[])
  return (
    <div className='layout-dbg'>
      <div className='docbox-wrapper pane-wrapper'>
        <DocBox rotateSome />
        <ThreeD rotateSome seeFake3d />
      </div>
      <div className='menu-wrapper pane-wrapper'>
        <Menu />
      </div>
      <div className='text-wrapper pane-wrapper'>
        <Text />
      </div>
      <div className='dbg-wrapper pane-wrapper'>
        <DbgCmds />
        <DbgEvs />
      </div>
    </div>
  )
}

export default Home

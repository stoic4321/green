import React from 'react'
import { Route, Switch } from 'react-router-dom'
import Home from './pages/home/Home'
import HomeDebug from './pages/home_debug/HomeDebug'
import DocBox from './pages/DocBox'
import Menu from './pages/menu/Menu'
import Text from './pages/Text'
import ThreeD from './pages/ThreeD'
import {Storyboards} from './components/core/Storyboards'
import {DbgCmds,DbgEvs} from './pages/DbgMsgs'
import './scss/application.scss'

const App = () => (
  <Switch>
    <Route exact path='/app/' component={Home} />
    <Route exact path='/app/debug' component={HomeDebug} />
    <Route exact path='/app/docbox' component={DocBox} />
    <Route exact path='/app/menu' component={Menu} />
    <Route exact path='/app/text' component={Text} />
    <Route exact path='/app/3d' component={ThreeD} />
    <Route exact path='/app/cmds' component={DbgCmds} />
    <Route exact path='/app/evs' component={DbgEvs} />
    <Route exact path='/app/storyboards' component={Storyboards} />
  </Switch>
)

export default App

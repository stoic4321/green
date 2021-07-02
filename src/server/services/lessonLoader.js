import { v4 } from 'uuid'
import yaml from 'js-yaml'
import { mapFiles } from '../helpers/mapFiles'

export function loadLessons() {
  const parseOneLsnFn = ((lsn) => parseLesson( yaml.load(lsn) ))
  const lsns = mapFiles( '/public/lessons', parseOneLsnFn, '.yml' ).sort((a, b) => a.ordering - b.ordering)
  //console.log( 'lsns:',lsns )
  return lsns
}

function parseLesson(lsn) {
  lsn.panels.steps.list = lsn.panels.steps.list.map((s,i)=>({ ...s, idx: i }))
  lsn.panels.tours.list = lsn.panels.tours.list.map((t,i)=>({ ...t, idx: i, text:t.tourText??t.text})) // copy tourText:{} to text:{}
  lsn.token = v4()
  return lsn
}

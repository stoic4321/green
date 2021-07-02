import { useEffect, useRef } from 'react'
import useFetch from '../../hooks/useFetch'
import yaml from 'js-yaml'
import { Text } from '../../components/text_pane/TextPane'
import { toTitleCase } from '../../helpers/toTitleCase'

function dig(t) {
  let obj = {text:{title:'ttl',description:'desc',action:'act', note:'note'}}
  t = t.split(/(?=\nNEXT\n)/g)
  t = t.map( x => {
    let ret = ''
    if (x.startsWith('step_')) {
      x = x.replace(/step_[0-9_]*/g,'').trim()
      if ((/\u000b/).test(x)) x = x.split(/\u000b/g)
      if (Array.isArray(x)) x = x.filter(x=>x).map(x=>x.trim())
      obj.text.description = x?.[0]
      obj.text.action = x?.[1]
    }
    if ((/^\n?NEXT\n?/).test(x)) {
      x = x.replace(/\s*NEXT\s*/g, '')//.replace(/\n.*/g,'').trim()
      obj.text.title = toTitleCase(x.replace(/\n.*/g,'').trim())
      obj.text.note = x.split(/\n/).slice(1,-1).join('\n')
      obj.text.note = obj.text.note.split(/\nLESSONS\n1/)?.[0]
    }
    if (obj.text.action?.startsWith('Click NEXT to continue')) {
      obj.wait_for = 'ui.next'
    }
    return x
  })
  return obj
}
//-----------|||||||---------------------------------
export const Storyboards = () => {
  let storyboards = useFetch('/api/lessons/storyboards')
  const txt = useRef([])
  useEffect(() => {
    const sb = storyboards.data
    if (sb) {
      let t = sb[0].split(/lesson_[0-9_\s]*/).slice(1).map( (x)=>x.split(/(?=step_[0-9_\s])/g).map( (y,i)=>( dig(((i>0)?'step_':'')+y)) ) )
      t = t.map(x=>x.filter(y=>((y.title!='ttl')&&(y.note!='note'))))
      t = t.map((x,i)=> x.map( (y,j)=>({id:`step_0${i+1}_${(((j+1)*10)+'').padStart(3, '0')}`, ...y} )))
      txt.current = t
    }
  }, [storyboards.data])
  return (!storyboards.data) ? 
  <div className="faint bg-dark">{'<Storyboards/> '}</div> 
    : 
    <div className="bg-dark" style={{fontSize: '1rem'}}>
      
      {false && txt.current && txt.current.map((x,i)=>
        <div key={i}>
          {x.map((y,j)=>(
            <div style={{transform:'scale(0.5)'}}>
              <Text key={j} {...y}/>
              <div style={{fontSize:'1.8rem'}}>
                Notes: {y.text.note}
              </div>
              <hr/>
            </div>
          ))}
        </div>
        )}
        {txt.current && txt.current.map((x,i)=>
          <div key={i}>
            <pre style={{whiteSpace: 'pre-wrap'}}>
              {yaml.dump(
                {panels:{steps:{
                  label: 'STEPS',
                  flavors: 'sequence',
                  list: x.map( prepStep )
                }}}, {
                  lineWidth:-1, 
                  forceQuotes:true, 
                  quotingType: '"',
                }
              )
              // .replace(/""/g,'QUOTEQUOTE')
              .replace(/\:\s+\"/g,':\t')
              .replace(/\"\n/g,'\n')
              // .replace(/QUOTEQUOTE/g,'""')
              .replace(/\n(      - )/g,'\n\n$1')
              }
            </pre>
            <hr/>
          </div>
        )}
    </div>
}

function prepStep(stp) {
  return {
    id: stp.id || "",
    text: {
      title: stp.text?.title || "",
      description: stp.text?.description || "",
      action: stp.text?.action || "",
      note:  stp.text?.note || "",
    },
    cameras: stp.cameras || "",
    highlights: stp.highlights || "",
    set: stp.set || "",
    wait_for: stp.wait_for || "",
  }
}

function prepTour(tour) {
  return {
    id: tour.id.replace('step_','tour_'),
    text: {
      title: tour.text.title || "",
      description: tour.text.description || "",
      note:  tour.text.note || "",
    },
    cameras: tour.cameras || "",
    highlights: tour.highlights || "",
    set: tour.set || "",
    pointAt: tour.pointAt || "",
    tour3dText:{
      title: tour?.tour3dText?.title ||"",
      description: tour?.tour3dText?.description ||"",
    }
  }
}
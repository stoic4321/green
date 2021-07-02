import { useState } from 'react'
import { TextPane } from '../components/text_pane/TextPane'

export default function Text() {
  const [msg, setMsg] = useState(null)
  return (
    <div className='h-100'>
      <TextPane
        {...{
          // msg: msg,
          title: 'Title text',
          description: 'Description text',
          action: 'Action text'
        }}
      />
    </div>
  )
}

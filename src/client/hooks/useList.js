import { useState } from 'react'

export const useList = (deflt = []) => {
  const [list, setList] = useState(deflt)
  const addOne = (one) => setList((list) => [...list, one])
  // const addOne = (one) => setList((list=>([...list, one]))
  return [list, setList, addOne]
}

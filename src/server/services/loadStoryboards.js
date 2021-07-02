import { mapFiles } from '../helpers/mapFiles'

export function loadStoryboards() {
  const parseOneFileFn = (stb) => stb
  // const parseOneFileFn = (stb) => JSON.parse( stb )
  const stbs = mapFiles( '/public/storyboards', parseOneFileFn, '.txt' )
  console.log( 'storyboards raw:', stbs[0].slice(0,45) )
  return stbs
}


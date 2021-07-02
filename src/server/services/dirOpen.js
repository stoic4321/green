import logger from '../util/logger'
import { execSync }  from 'child_process'

export function dirOpen(dirPath) {
  let showVerb = 'xdg-open' // default
  const pl = process.platform
  if (pl=='darwin') {
    showVerb = 'open'
  }
  if (pl=='win32') {
    showVerb = 'explore'
  }
  try{

    const mkdirCmd = `mkdir -p "${dirPath}"`
    logger.debug(`execSync(${mkdirCmd})`)
    logger.debug( execSync(  mkdirCmd ) )
    
    const showFolderCmd = `${showVerb} "${dirPath}"`
    logger.debug(`execSync(${showFolderCmd})`)
    logger.debug( execSync(  showFolderCmd ) )
  } catch(e) {
    logger.warn(`Error: dirOpen(${dirPath})`)
    logger.warn(e)
  }
}

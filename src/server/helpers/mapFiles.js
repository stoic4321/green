import fs from 'fs';
import path from 'path';
import logger from '../util/logger';


export const pathedFilesOfFolder = (relFolder, extensions = null) => {
  const folder = path.join(__dirname, relFolder);
  let fileNames = fs.readdirSync(folder);
  if (!fileNames)
    return [];
  if (extensions)
    fileNames = fileNames.filter(f => extensions.includes(path.extname(f)));
  return fileNames.map(x => path.join(folder, x));
};

export const mapFiles = (relFolder, func, extensions = null) => {
  const fnames = pathedFilesOfFolder(relFolder, extensions);
  console.log('fnames:',fnames);
  const result = fnames.map((fn) => {
    let data = null;
    try {
      data = func(fs.readFileSync(fn, 'utf8'));
    } catch (ex) {
      logger.error(ex)
      logger.error(ex.stack)
    }
    return data;
  }).filter(x => !!x);
  return result;
};

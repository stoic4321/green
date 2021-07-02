import path from 'path'
var fs = require('fs')

export function addToFile( fname, txt ) {
  const homedir = require('os').homedir()
  fname = fname.replace(/[\s,]/g,'_').replace(/[:\/]/g,'-')
  fname = path.join(homedir,'Lesson_Test_Results', fname)
  console.log({fn:'addToFile()',fname,txt})
  var stream = fs.createWriteStream(fname, {flags: 'a'});
  stream.end(txt);
}
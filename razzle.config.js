'use strict';

console.log('================================')
console.log('=   Using: /razzle.config.js   =')
console.log('================================')
'use strict';

module.exports = {
  plugins: ['scss'],
  options: {
    forceRuntimeEnvVars: ['HOST', 'PORT']
  }
};
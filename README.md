# easy-promise
Pnly Promises/A+ implementation
If you want to make a more powerful `Promise` class, it is recommended to use the [extend-promise](https://github.com/cnwhy/extend-promise) extension.

## API
 - `new Promise`
 - `Promise.defer`
 - `Promise.resolve`
 - `Promise.reject`
 - `.then`

## Install
**npm**  
`npm install easy-promise`  
**bower**  
`bower install easy-promise`  

## Use
```
//Internal use of process.nextTick
var Ep = require('esay-promise')

//or Use setImmediate ,Used For high concurrency scenarios
var Ep = require('esay-promise/setImmediate')

//or setTimeout , Used for browser projects
var Ep = require('esay-promise/setTimeout')
```

### In the no Promise browser
 - `dist/easy-Promise.js` (gzip 1.8k)
 - `dist/easy-Promise.min.js` (gzip 1.2k)


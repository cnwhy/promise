var Promise = require('../');

// Promise.all([1,2]).then(console.log.bind(console,'ok: '),console.log.bind(console,'no: '));
// Promise.all([Promise.resolve(1),2]).then(console.log.bind(console,'ok: '),console.log.bind(console,'no: '));
// Promise.all([Promise.reject(1),2]).then(console.log.bind(console,'ok: '),console.log.bind(console,'no: '));
// Promise.all([new Promise(function(ok,no){
//     setTimeout(ok,1000,1)
// }),new Promise(function(ok,no){
//     ok(2);
//     setTimeout(ok,2000,3)
// })]).then(console.log.bind(console,'ok: '),console.log.bind(console,'no: '));


Promise.resolve(1).finally(function(){
    return Promise.reject(2);
    throw 2;
    // return 2;
    // return new Promise(function(ok,no){
    //     // setTimeout(no,1000,2)
    //     setTimeout(no,1000,2)
    // })
}).then(console.log.bind(console,'ok: '),console.log.bind(console,'no: '));

Promise.resolve(11).finally(33).then(console.log.bind(console,'ok: '),console.log.bind(console,'no: '));
Promise.reject(11).finally(33).then(console.log.bind(console,'ok: '),console.log.bind(console,'no: '));

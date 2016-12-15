var tests = require('promises-aplus-tests');
var Promise = require('../');
Promise.deferred = Promise.defer;
tests.mocha(Promise);

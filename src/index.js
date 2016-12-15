"use strict";
module.exports = function(nextTick){
	function Resolve(promise, x) {
		if(x instanceof Promise_){
			x.then(promise.resolve,promise.reject)
		};
		if (x && (typeof x === 'function' || typeof x === 'object')) {
			var called = false,then;
			try {
				then = x.then;
				if (typeof then === 'function') {
					then.call(x, function(y) {
						if (called) return;
						called = true;
						Resolve(promise, y);
					}, function(r) {
						if (called) return;
						called = true;
						promise.reject(r);
					});
				}else {
					promise.resolve(x);
				}
			}catch (e) {
				if (!called) {
					called = true;
					promise.reject(e);
				}
			}
		}else {
			promise.resolve(x);
		}
	}

	function Promise_(fun){
		//var defer = this.defer = new Defer(this);
		var self = this;
		this.status = -1;  //pending:-1 ; fulfilled:1 ; rejected:0
		this._events = [];
		var lock = false;
		function _resolve(value){
			changeStatus.call(self,1,value)
		}
		function _reject(reason){
			changeStatus.call(self,0,reason)
		}
		this.resolve = function(value){
			if(lock) return;
			lock = true;
			if(self === value){
				return _reject(new TypeError("The promise and its value refer to the same object"));
			} 
			// if(value instanceof Promise_){
			// 	value.then(_resolve,_reject)
			// }else{
			Resolve({resolve:_resolve,reject:_reject},value)
			//}
		}
		this.reject = function(reason){
			if(lock) return;
			lock = true;
			_reject(reason);
		}
		if(typeof fun == "function"){
			try{
				fun(this.resolve,this.reject);
			}catch(e){
				this.reject(e)
			}
		}
	}

	Promise_.defer = function(){
		var _resolve,_reject;
		var _promise = new Promise_(function(ok,no){
			_resolve = ok;
			_reject = no;
		});
		return {
			promise: _promise,
			resolve: _resolve,
			reject: _reject
		}
	}

	Promise_.resolve = function(obj){
		if(obj instanceof Promise_) return obj;
		return new Promise_(function(ok,no){
			ok(obj);
		})
	}

	Promise_.reject = function(err){
		return new Promise_(function(ok,no){
			no(err);
		})
	}

	Promise_.prototype.then = function(ok,no){
		var status = this.status;
		var defer = Promise_.defer()
			,promise = defer.promise
			
		// if(!~status){
		//  this.events.push([ok,no,promise]);
		// }else if(status && typeof ok == "function"){
		//  runThen(ok,this.value,promise,status);
		// }else if(!status && typeof no == "function"){
		//  runThen(no,this.reason,promise,status)
		// }else{
		//  if(status) defer.resolve(this.value)
		//  else defer.reject(this.reason);
		// }

		this._events.push([ok,no,promise]);
		runThens.call(this)
		return promise;
	}

	function changeStatus(status,arg){
		var self = this;
		if(~this.status) return;
		this.status = status;
		if(status){
			this.value = arg
		}else{
			this.reason = arg;
		}
		nextTick(function(){
			runThens.call(self)
		})
	}

	function runThens(){
		if(!~this.status) return;
		var self = this
			,_event = self._events
			,arg = self.status ? self.value : self.reason
			,FnNumb = self.status ? 0 : 1;
		while(_event.length){
			(function(eArr){
				var resolve,reject
				var fn = eArr[FnNumb]
					,nextQ = eArr[2]
				runThen(fn,arg,nextQ,self.status);
			})(_event.shift())
		}
	}

	function runThen(fn,arg,nextQ,status){
		var resolve,reject
		if(nextQ){
			resolve = nextQ.resolve
			reject = nextQ.reject 
		}
		if(typeof fn == 'function'){
			nextTick(function(){
				var nextPromise;
				try{
					nextPromise = fn(arg)
				}catch(e){
					if(reject) reject(e)
					else throw e;
					return;
				}
				if(resolve) resolve(nextPromise);
			})
		}else if(nextQ){
			if (status) resolve(arg)
			else reject(arg)
		}
	}
	return Promise_;
}
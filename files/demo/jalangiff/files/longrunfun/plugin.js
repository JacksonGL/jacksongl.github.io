/*
* Copyright (c) 2014, University of California, Berkeley
* All rights reserved.
*
* Redistribution and use in source and binary forms, with or without
* modification, are permitted provided that the following conditions are met:
*
* 1. Redistributions of source code must retain the above copyright notice, this
* list of conditions and the following disclaimer.
* 2. Redistributions in binary form must reproduce the above copyright notice,
* this list of conditions and the following disclaimer in the documentation
* and/or other materials provided with the distribution.
*
* THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
* ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
* WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
* DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
* ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
* (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
* LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
* ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
* (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
* SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*
* The views and conclusions contained in the software and documentation are those
* of the authors and should not be interpreted as representing official policies,
* either expressed or implied, of the FreeBSD Project.
*/

// Author: Liang Gong

((function (sandbox){
	var HAS_OWN_PROPERTY = Object.prototype.hasOwnProperty;
	var HAS_OWN_PROPERTY_CALL = Object.prototype.hasOwnProperty.call;
	var HOP = function (obj, prop) {
		return (prop + "" === '__proto__') || HAS_OWN_PROPERTY_CALL.apply(HAS_OWN_PROPERTY, [obj, prop]);
	}
	var DATE = Date;
	var timeList = [];
	var fundb = {};
	var iidToLocation = sandbox.iidToLocation;

	// before invoking a function/method
	function invokeFunPre (iid, f, base, args, isConstructor) {
		//console.log('before calling ' + f.name + ': ' + instructCnt);
		timeList.push(new DATE());
	}

	// during invoking a function/method
	// val is the return value and should be returned
	function invokeFun (iid, f, base, args, val, isConstructor) {
		var startTime = timeList.pop();
		var diffTime = (new DATE() - startTime)/1000;
		var sig = f.toString();
		if(fundb[sig]) {
			var innerDB = fundb[sig];
			innerDB.totalTime += diffTime;
			innerDB.cnt ++;
			if(innerDB.maxTime < diffTime) {
				innerDB.maxTime = diffTime;
				innerDB.maxTimeIID = iid;
			}
		} else {
		  fundb[sig] = {totalTime: diffTime, cnt: 1, fun: f, maxTime: diffTime, maxTimeIID: iid};
		}
		return val;
	}
	
	function endExecution() {
		console.log('function execution time:');
		for(var prop in fundb) {
			if(HOP(fundb, prop)){
				var info = fundb[prop];
			if(info.maxTime < 0.1) continue;
				console.log(info.fun.name + ', average time to complete: ' + info.totalTime/info.cnt + 's ('+info.totalTime+'/'+info.cnt+')');
				console.log('\t' + 'max time to complete: ' + info.maxTime + 's @: ' + iidToLocation(info.maxTimeIID));
			}
		}
	}

	sandbox.analysis = {};
	sandbox.analysis.invokeFunPre = invokeFunPre;
	sandbox.analysis.invokeFun = invokeFun;
	sandbox.analysis.endExecution = endExecution;
})(J$));
/*
 * Copyright 2014 University of California, Berkeley.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *		http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Liang Gong

J$.analysis = {};

((function (sandbox){
	var HAS_OWN_PROPERTY = Object.prototype.hasOwnProperty;
	var HAS_OWN_PROPERTY_CALL = Object.prototype.hasOwnProperty.call;
	var HOP = function (obj, prop) {
		return (prop + "" === '__proto__') || HAS_OWN_PROPERTY_CALL.apply(HAS_OWN_PROPERTY, [obj, prop]);
	}
	var instructCnt = 0;
	var instCntList = [];
	var fundb = {};
	
	// called before reading a variable
	function readPre (iid, name, val, isGlobal) {
	}
	
	// called during reading a variable, 
	// val is the read value, do not forget to return it
	function read (iid, name, val, isGlobal) {
		instructCnt++;
		return val;
	}
	
	// called before writing a variable
	function writePre (iid, name, val) {
	}

	// called during writing a variable
	// val is the value to be written, do not forget to return it
	function write (iid, name, val) {
		instructCnt++;
		return val;
	}
	
	// called before setting field to an entity (e.g., object, function etc.)
	// base is the entity, offset is the field name, so val === base[offset]
	// should return val
	function putFieldPre (iid, base, offset, val) {
		return val;
	}

	// called during setting field
	// should return val
	function putField (iid, base, offset, val) {
		instructCnt++;
		return val;
	}
	
	// before retrieving field from an entity
	function getFieldPre (iid, base, offset) {
	}

	// during retrieving field from an entity
	function getField (iid, base, offset, val) {
		instructCnt++;
		return val;
	}
	
	// before creating a literal
	function literalPre (iid, val) {
	}

	// during creating a literal
	// should return val
	function literal (iid, val) {
		instructCnt++;
		return val;
	}

	// before invoking a function/method
	function invokeFunPre (iid, f, base, args, isConstructor) {
		//console.log('before calling ' + f.name + ': ' + instructCnt);
		instCntList.push(instructCnt);
	}

	// during invoking a function/method
	// val is the return value and should be returned
	function invokeFun (iid, f, base, args, val, isConstructor) {
		instructCnt++;
		var InstructPre = instCntList.pop();
		var instructCntDiff = (instructCnt - InstructPre);
		var sig = f.toString();
		if(fundb[sig]) {
			if(fundb[sig].isMem === false){
				return val;
			}
			fundb[sig].totalInst += instructCntDiff;
			fundb[sig].cnt ++;
		} else {
		  fundb[sig] = {totalInst: instructCntDiff, cnt: 1, fun: f, io:{}, isMem: true, redOpCnt: 0};
		}
		var inputSig = JSON.stringify(args);
		if(fundb[sig][inputSig]){
			if(fundb[sig][inputSig] === val){
				fundb[sig].redOpCnt++; // a redundant operation
			} else {
				fundb[sig].isMem = false;
			}
		} else {
			fundb[sig][inputSig] = val;
		}
		return val;
	}
	
	// before doing a binary operation
	function binaryPre (iid, op, left, right) {
	}

	// during a binary operation
	// result_c is the result and should be returned
	function binary (iid, op, left, right, result_c) {
	instructCnt++;
		return result_c;
	}

	// before doing a unary operation
	function unaryPre (iid, op, left) {
	}

	// during a unary operation
	// result_c is the result and should be returned
	function unary (iid, op, left, result_c) {
	instructCnt++;
		return result_c;
	}

	// before getting a conditional expression evaluation
	function conditionalPre (iid, left) {
	}

	// during a conditional expression evaluation
	// result_c is the evaluation result and should be returned
	function conditional (iid, left, result_c) {
	instructCnt++;
		return result_c;
	}
	
	function endExecution() {
		console.log('The following functions/methods may be memoized:');
		for(var prop in fundb) {
			if(HOP(fundb, prop)){
				var info = fundb[prop];
				if(fundb[prop].isMem === true) {
					console.log(info.fun.name + ', instructions on average to complete: ' + info.totalInst/info.cnt);
					console.log('\t' + 'redundant Rate: ' + info.redOpCnt/info.cnt + '(' + info.redOpCnt + '/' + info.cnt +')');
				}
			}
		}
	}
	
	sandbox.readPre = readPre;
	sandbox.read = read;
	sandbox.writePre = writePre;
	sandbox.write = write;
	sandbox.putFieldPre = putFieldPre;
	sandbox.putField = putField;
	sandbox.literalPre = literalPre;
	sandbox.literal = literal;
	sandbox.invokeFunPre = invokeFunPre;
	sandbox.invokeFun = invokeFun;
	sandbox.getFieldPre = getFieldPre;
	sandbox.getField = getField;
	sandbox.binaryPre = binaryPre;
	sandbox.binary = binary;
	sandbox.unaryPre = unaryPre;
	sandbox.unary = unary;
	sandbox.conditionalPre = conditionalPre;
	sandbox.conditional = conditional;
  sandbox.endExecution = endExecution;
})(J$.analysis));
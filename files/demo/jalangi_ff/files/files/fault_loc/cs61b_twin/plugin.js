/*
 * Copyright 2014 University of California, Berkeley.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Liang Gong
// Think about how many research projects are based on tracing and spectrum.
// Now you can do it for any real-world website :)

J$.analysis = {};

((function (sandbox){
    var profile = [];
    var trace = [];
  
    function addProfileCount(iid){
        trace.push(iid);
        if(profile[iid]){
            profile[iid]++;
        }else{
            profile[iid] = 1;
        }
    }
    // called before reading a variable
    function readPre (iid, name, val, isGlobal) {
        
    }
    
    // called during reading a variable, 
    // val is the read value, do not forget to return it
    function read (iid, name, val, isGlobal) {
    addProfileCount(iid);
        return val;
    }
    
    // called before writing a variable
    function writePre (iid, name, val) {
    }

    // called during writing a variable
    // val is the value to be written, do not forget to return it
    function write (iid, name, val) {
    addProfileCount(iid);
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
    addProfileCount(iid);
        return val;
    }
    
    // before retrieving field from an entity
    function getFieldPre (iid, base, offset) {
    }

    // during retrieving field from an entity
    function getField (iid, base, offset, val) {
    addProfileCount(iid);
        return val;
    }
    
    // before creating a literal
    function literalPre (iid, val) {
    }

    // during creating a literal
    // should return val
    function literal (iid, val) {
    addProfileCount(iid);
        return val;
    }

    // before invoking a function/method
    function invokeFunPre (iid, f, base, args, isConstructor) {
    }

    // during invoking a function/method
    // val is the return value and should be returned
    function invokeFun (iid, f, base, args, val, isConstructor) {
    addProfileCount(iid);
        return val;
    }
    
    // before doing a binary operation
    function binaryPre (iid, op, left, right) {
    }

    // during a binary operation
    // result_c is the result and should be returned
    function binary (iid, op, left, right, result_c) {
    addProfileCount(iid);
        return result_c;
    }

    // before doing a unary operation
    function unaryPre (iid, op, left) {
    }

    // during a unary operation
    // result_c is the result and should be returned
    function unary (iid, op, left, result_c) {
    addProfileCount(iid);
        return result_c;
    }

    // before getting a conditional expression evaluation
    function conditionalPre (iid, left) {
    }

    // during a conditional expression evaluation
    // result_c is the evaluation result and should be returned
    function conditional (iid, left, result_c) {
    addProfileCount(iid);
        return result_c;
    }
  
    function printTrace(){
        console.log('Sequential trace:')
        console.log(JSON.stringify(trace));
        console.log('-----')
        console.log('Spectrum:')
        for(var i=0;i<profile.length;i++){
            if(profile[i]){
                console.log('[' + i + ']: ' + profile[i]);
            }
        }
    }
  
    function getTrace() {
        return profile;
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
    sandbox.printTrace = printTrace;
    sandbox.getTrace = getTrace;
})(J$.analysis));
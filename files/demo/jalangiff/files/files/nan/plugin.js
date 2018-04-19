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

((function (sandbox) {
    var ISNAN = isNaN;
    var iidToLocation = sandbox.iidToLocation;
  
    function putFieldPre (iid, base, offset, val) {
        if(typeof base !== 'undefined' && base !== null && (typeof val === 'number') && ISNAN(val) == true){
            console.log('[Location: ' + iidToLocation(iid) +'] putField: ' + base + '.' + offset + ':' + val);
        }
        return val;
    }

    function literalPre (iid, val){
        if(typeof val === 'number' && ISNAN(val)){
            console.log('[Location: ' + iidToLocation(iid) +'] introduing NaN literal:' + val);
        }
    }

    function binary (iid, op, left, right, result_c) {
        if(typeof result_c === 'number' && ISNAN(result_c)){
            console.log('[Location: ' + iidToLocation(iid) +'] binary operation leads to NaN:' + result_c + ' <- ' + left + ' [' + typeof left + '] ' + op + ' ' + right + ' [' + typeof right + '] ');
        }
        return result_c;
    }

    function writePre (iid, name, val, lhs) {
        if(typeof val === 'number' && ISNAN(val)){
            console.log('[Location: ' + iidToLocation(iid) +'] writing NaN value to variable:' + name + ': ' + val);
        }
    }

    function getField (iid, base, offset, val) {
        if(typeof base !== 'undefined' && base !== null && (typeof val === 'number') && ISNAN(val) == true){
            console.log('[Location: ' + iidToLocation(iid) +'] getField: ' + base + '.' + offset + ':' + val);
        }
        return val;
    }

    function return_Rt (iid, val) {
        if(typeof val === 'number' && ISNAN(val)){
            console.log('[Location: ' + iidToLocation(iid) +'] return NaN:' + val);
        }
        return val;
    }

    function readPre (iid, name, val, isGlobal) {
        if(typeof val === 'number' && ISNAN(val)){
            console.log('[Location: ' + iidToLocation(iid) +'] read NaN from variable ' + name + ' :' + val);
        }
    }

    function declare (iid, name, val, isArgumentSync) {
        if(typeof val === 'number' && ISNAN(val)){
            console.log('[Location: ' + iidToLocation(iid) +'] declare NaN in variable ' + name + ' :' + val);
        }
    }

    function unary (iid, op, left, result_c) {
        if(typeof result_c === 'number' && ISNAN(result_c)){
            console.log('[Location: ' + iidToLocation(iid) +'] get NaN in unary operation: ' + result_c + ' <- ' + op + left + ' [' + typeof left + ']');
        }
        return result_c;
    }

    function conditionalPre (iid, left) {
        if(typeof left === 'number' && ISNAN(left)){
            console.log('[Location: ' + iidToLocation(iid) +'] get NaN in conditional: ' + left);
        }
    }

    var analysis = sandbox.analysis = {};

    analysis.putFieldPre = putFieldPre;
    analysis.literalPre = literalPre;
    analysis.binary = binary;
    analysis.writePre = writePre;
    analysis.getField = getField;
    analysis.return_Rt = return_Rt;
    analysis.readPre = readPre;
    analysis.declare = declare;
    analysis.unary = unary;
    analysis.conditionalPre = conditionalPre;
})(J$));
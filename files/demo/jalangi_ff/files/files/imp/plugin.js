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

J$.analysis = {};

((function (sandbox) {
    var num = 0;
    var susp_num = 0;
    var ISNAN = isNaN;
	
    function isMeaningless (val) {
        if(typeof val == 'undefined'){
            return true;
        } else if(typeof val == 'number' && isNaN(val)){
            return true;
        }
        return false;  
    }

    function binary (iid, op, left, right, result_c) {
         if(((isMeaningless(left) || isMeaningless(right)) && op != '==' && op != '!=' && op != '===' && op != '!==' && op != 'instanceof' && op != 'in' && op != '&&' && op != '||')
            || typeof result_c == 'undefined' ||  ((typeof result_c == 'number') && isNaN(result_c) == true)) {
            console.warn('left: ' + left + '[' + typeof left +']' + '  op:' + op + '  right: ' + right + '[' + typeof right +']');
            num++;
        }

        if(typeof left !== typeof right && op!= '>' && op!= '>=' && op!= '<' && op!= '<=' && op != '==' && op != '!=' && op != '===' && op != '!==' && op != 'instanceof' && op != 'in' && op != '&&' && op != '||') {
            if(op!== '+') {
                console.log('@2[strange binary operation: | iid: ' + iid +']:' + result_c);
                console.log('left: ' + left + '[' + typeof left +']' + '  op:' + op + '  right: ' + right + '[' + typeof right +']');
                susp_num++;
            }
        }
        return result_c;
    }

    sandbox.binary = binary;
})(J$.analysis));
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
    var db = {};
    var INFINITE_THRESHOLD = 10000;
    function getLocation(iid) {
        if(window.getLocationFromIID){
            return window.getLocationFromIID(iid);
        } else {
            return '[iid]: ' + iid;
        }
    }
    
    // during a conditional expression evaluation
    // result_c is the evaluation result and should be returned
    function conditional (iid, left, result_c) {
        if(result_c === false) {
            delete db[iid];
        } else {
            if(db[iid]) {
                db[iid].count++;
                if(db[iid].count > INFINITE_THRESHOLD) {
                    console.log('kill the infinite loop at ' + getLocation(iid));
                    result_c = false;
                }
            } else {
                db[iid] = {count: 1};
            }
        }
        return result_c;
    }
    sandbox.conditional = conditional;
})(J$.analysis));
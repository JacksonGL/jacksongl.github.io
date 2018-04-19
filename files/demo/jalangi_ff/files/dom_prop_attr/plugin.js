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
    var ISNAN = isNaN;
    var db = {};
    var objID = 1;
    var SPECIAL_PROP = 'J$_objID';
    
    function isPathAbsolute(path) {
        return /^(?:\/|[a-z]+:\/\/)/.test(path);
    }
    
    function putFieldPre (iid, base, offset, val) {
        // check setting relative path
        if(base && base instanceof HTMLElement) {
            if(!base[SPECIAL_PROP]) {
                // assign an object id to the html dom element
                Object.defineProperty(base, SPECIAL_PROP, {
                    enumerable:false,
                    writable:true
                });
                base[SPECIAL_PROP] = {};
            }
            if(base[SPECIAL_PROP] && offset && offset === 'src') {
                if(!db[base[SPECIAL_PROP]]) db[base[SPECIAL_PROP]] = {};
                if(val && !isPathAbsolute(val)){
                    db[base[SPECIAL_PROP]].isRelative = true;
                } else {
                    db[base[SPECIAL_PROP]].isRelative = false;
                }
            }
        }
        return val;
    }
    
    function getField (iid, base, offset, val) {
        if(base && base instanceof HTMLElement) {
            // assign an object id to the html dom element
            if(offset && offset === 'src') {
                if(base[SPECIAL_PROP] && db[base[SPECIAL_PROP]]) {
                    if(db[base[SPECIAL_PROP]].isRelative){
                        console.log('Warning: at iid ' + iid + ', retrieved src is an absolute path, while set it as a relative path');
                    }
                }
            }
        }
        return val;
    }

    sandbox.putFieldPre = putFieldPre;
    sandbox.getField = getField;
})(J$.analysis));
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
    var SPECIAL_PROP = 'J$-'
      var iidToLocation = function (iid) {
      if (window.getLocationFromIID) {
        return window.getLocationFromIID(iid);
      } else {
        return '[iid]: ' + iid;
      }
    }
    var HAS_OWN_PROPERTY = Object.prototype.hasOwnProperty;
    var HAS_OWN_PROPERTY_CALL = Object.prototype.hasOwnProperty.call;
    var HOP = function (obj, prop) {
      return (prop + "" === '__proto__') 
	    || HAS_OWN_PROPERTY_CALL.apply(HAS_OWN_PROPERTY, [obj, prop]);
    }

    var analysisDB = ((function () {
        var db = {};
        var module = {};
        module.record = function (iid, val) {
            var sig = val.toString();
            if (db[iid]) {
              if (db[iid][sig]) {
                db[iid][sig].count++;
              } else {
                db[iid][sig] = {
                  count : 1
                };
              }
            } else {
              db[iid] = {};
              db[iid][sig] = {
                count : 1
              };
            }
        };

        module.print = function () {
          console.log('Excessive get field operations:')
          for (var iid in db) {
            var str = '';
            if (HOP(db, iid)) {
              str = '[Location]: ' + iidToLocation(iid);
              var innerDB = db[iid];
              var isPrint = false;
              for (var pattern in innerDB) {
                if (HOP(innerDB, pattern)) {
                  if(innerDB[pattern].count > 1) {
                    isPrint = true;
                    str += '\r\n\t [pattern]: ' + pattern + 
					  ' \t| [count]: ' + innerDB[pattern].count;
                  }
                }
              }
              if (isPrint) {
                console.log(str);
              }
            }
          }
        }

        return module;
      })());
    
    function setShadowValue(base, index, value) {
      if (base && (typeof base === 'object' || typeof base === 'function') 
	      && Object && Object.defineProperty 
		  && typeof Object.defineProperty === 'function') {
        
		Object.defineProperty(base, SPECIAL_PROP + index, {
          enumerable : false,
          writable : true
        });
        base[SPECIAL_PROP + index] = value;
      }
    }

    function getShadowValue(base, index) {
      if (base && (typeof base === 'object' 
	      || typeof base === 'function')) {
        return base[SPECIAL_PROP + index]
      } else {
        return undefined;
      }
    }

    function clearShadowValue(base, index) {
      if (base && (typeof base === 'object' 
	      || typeof base === 'function')) {
        delete base[SPECIAL_PROP + index];
      }
    }

    // called during reading a variable,
    // val is the read value, do not forget to return it
    function read(iid, name, val, isGlobal) {
      setShadowValue(val, 'name', name);
      return val;
    }

    // during retrieving field from an entity
    function getField(iid, base, offset, val) {
      var basename = getShadowValue(base, 'name');
      if(!basename) {
        basename = '[unknown]';
      }
      setShadowValue(val, 'name', basename + '.' + offset);
      var name = getShadowValue(val, 'name');
      if(name) {
        analysisDB.record(iid, name);
      }
      return val;
    }
    
    function endExecution() {
	  console.log('---Inefficient loading property operations:---');
      analysisDB.print();
    }

    sandbox.read = read;
    sandbox.getField = getField;
    sandbox.endExecution = endExecution;
  })(J$.analysis));
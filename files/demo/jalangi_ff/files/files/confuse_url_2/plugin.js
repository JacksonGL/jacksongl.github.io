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
// Date: 09/11/2014
 
J$.analysis = {};

((function (sandbox){
  var iidToLocation = function (iid) {
    if (window.getLocationFromIID) {
      return window.getLocationFromIID(iid);
    } else {
      return '[iid]: ' + iid;
    }
  }
  
  // called before setting field to an entity (e.g., object, function etc.)
  // base is the entity, offset is the field name, so val === base[offset]
  // should return val
  function putFieldPre (iid, base, offset, val) {
    if(base === window && offset === 'location') {
      if(typeof val === 'string' &&
        (val.indexOf('\u2044')>=0 || val.indexOf('\u2215')>=0)) {
        console.log('[warning]: directing to misleading URL at location: ' + iidToLocation(iid));
        console.log('[info]:    looks like the destination is:');
        var index = val.indexOf('\u2044') >= 0 ? val.indexOf('\u2044') : val.indexOf('\u2215');
        console.log('   ' + val.substring(0, index));
        console.log('[action]:  real destination:');
        console.log('   ' + val.substring(index + 1, val.length));
        console.log('[action]:  redirection abort');
        val = window.location + '#';
      }
    }
    return val;
  }
  
  sandbox.putFieldPre = putFieldPre;
})(J$.analysis));
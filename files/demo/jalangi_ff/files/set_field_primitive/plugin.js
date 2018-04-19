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
// Date: 06/17/2014
 
J$.analysis = {};

((function (sandbox) {
    var iidToLocation = function (iid) {
      if (window.getLocationFromIID) {
        return window.getLocationFromIID(iid);
      } else {
        return '[iid]: ' + iid;
      }
    }
    // called during setting field
    // should return val
    function putField(iid, base, offset, val) {
      if (typeof base === 'boolean' || typeof base === 'number' || typeof base === 'string') {
        console.log('setting field ' + offset + ' to primitive value ' + base + ' of type ' + typeof base);
        console.log('\t @' + iidToLocation(iid));
      }
      return val;
    }

    sandbox.putField = putField;
})(J$.analysis));
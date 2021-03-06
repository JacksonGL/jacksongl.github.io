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
// Date: 10/17/2014

J$.analysis = {};

(function (sandbox) {
  function AnalysisEngine() {
    var smemory = sandbox.smemory;
    var iidToLocation = sandbox.iidToLocation;
    var Constants = sandbox.Constants;
    var Config = sandbox.Config;
    var HOP = Constants.HOP;
    var sort = Array.prototype.sort;

	// if setting property of an object has no actual effect, then report a bug.
    this.putField = function (iid, base, offset, val) {
      if(base && base[offset] !== val){
        console.log('[warning]: setting property \"' + offset + '\" of a base entity (type ' + typeof base + ') with value ' + val + ' does not work.');
        console.log('\t[@ ' + iidToLocation(iid) + ']');
      }
      return val;
    };
  }

  sandbox.analysis = new AnalysisEngine();
}(J$));
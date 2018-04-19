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
 
/*
 *  A very simple hello world program
 *  demonstrating some simple operation
 *  interception using Jalangi
 */

J$.analysis = {};

(function (sandbox) {
  function AnalysisEngine() {
    var iidToLocation = sandbox.iidToLocation;

    function showLocation(iid) {
      console.log('  Source Location: ' + iidToLocation(iid));
    }

    this.literal = function (iid, val) {
      console.log('creating literal operation intercepted: ' + val);
      showLocation(iid);
      return val;
    };

    this.invokeFunPre = function (iid, f, base, args, isConstructor) {
      console.log('function call intercepted before invoking');
      showLocation(iid);
    };

    this.invokeFun = function (iid, f, base, args, val, isConstructor) {
      console.log('function call intercepted after invoking');
      showLocation(iid);
      return val;
    };

    this.getField = function (iid, base, offset, val) {
      console.log('get field operation intercepted: ' + offset);
      showLocation(iid);
      return val;
    }

    this.read = function (iid, name, val, isGlobal) {
      console.log('reading variable operation intercepted: ' + name);
      showLocation(iid);
      return val;
    };

    this.write = function (iid, name, val, oldValue) {
      console.log('writing variable operation intercept: ' + name);
      showLocation(iid);
      return val;
    };

    this.binary = function (iid, op, left, right, result_c) {
      console.log('binary operation intercepted: ' + op);
      showLocation(iid);
      return result_c;
    };
  }

  sandbox.analysis = new AnalysisEngine();
})(J$);
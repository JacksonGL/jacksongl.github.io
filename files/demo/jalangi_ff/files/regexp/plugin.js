/*
 * Copyright (c) 2014, University of California, Berkeley
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those
 * of the authors and should not be interpreted as representing official policies,
 * either expressed or implied, of the FreeBSD Project.
 */

// Author: Liang Gong

J$.analysis = {};

((function (sandbox) {
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
      return (prop + "" === '__proto__') || HAS_OWN_PROPERTY_CALL.apply(HAS_OWN_PROPERTY, [obj, prop]);
    }
    var REGEXP = RegExp;
    var analysisDB = ((function () {
        var db = {};
        var module = {};
        module.record = function (iid, val) {
          if (val instanceof RegExp) {
            var sig = val.toString();
            if (db[sig]) {
              if (db[sig][iid]) {
                db[sig][iid].count++;
              } else {
                db[sig][iid] = {
                  count : 1
                };
              }
            } else {
              db[sig] = {};
              db[sig][iid] = {
                count : 1
              };
            }
          }
        };

        module.print = function () {
          console.log('The following regular expressions may be refactored to be defined just once:');
          for (var prop in db) {
            var str = '';
            var occurCnt = 0;
            if (HOP(db, prop)) {
              str += 'RegExp: ' + prop + '\r\n';
              var innerDB = db[prop];
              for (var p in innerDB) {
                if (HOP(innerDB, p)) {
                  occurCnt++;
                  str += '\t [@: ' + iidToLocation(p) + '] count: ' + innerDB[p].count + '\r\n';
                }
              }
              if (occurCnt > 1) {
                console.log(str);
              }
            }
          }
        }

        return module;
      })());

    // during creating a literal
    // should return val
    function literal(iid, val) {
      if (val instanceof REGEXP) {
        analysisDB.record(iid, val);
      }
      return val;
    }

    function invokeFun(iid, f, base, args, val, isConstructor) {
      if (f === REGEXP && isConstructor && val instanceof REGEXP) {
        analysisDB.record(iid, val);
      }
      return val;
    }

    function endExecution() {
      analysisDB.print();
    }

    sandbox.literal = literal;
    sandbox.invokeFun = invokeFun;
    sandbox.endExecution = endExecution;
  })(J$.analysis));
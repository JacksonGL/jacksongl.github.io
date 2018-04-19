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

(function (sandbox) {
  function SlowBinaryDetector() {
    var smemory = sandbox.smemory;
    var iidToLocation = sandbox.iidToLocation;
    var Constants = sandbox.Constants;
    var Config = sandbox.Config;
    var HOP = Constants.HOP;
    var sort = Array.prototype.sort;
    var info = {};
    this.binary = function (iid, op, left, right, result_c) {
      if(typeof right === 'number' && right === 2) {
        if(!info[iid]) {
          info[iid] = {cnt: 1};
        }
        info[iid].cnt++;
      }
      return result_c;
    };
    
    this.endExecution = function() {
      for(var prop in info) {
        if(HOP(info, prop)) {
          console.log('[warning]: inefficient code pattern: value%2');
          console.log('\t@' + iidToLocation(prop) + ' | cnt: ' + info[prop].cnt);
          console.log('\t[suggestion]Refactor -> !(value&1)');
        }
      }
    }
  }

  sandbox.analysis = new SlowBinaryDetector();
}(J$));
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

    var SET_INTERVAL = setInterval;
    var SET_TIMEOUT = setTimeout;
    var FUNCTION = Function;
    var EVAL = eval;

    // before invoking a function/method
    function invokeFunPre(iid, f, base, args, isConstructor) {
      if (f === FUNCTION || f === EVAL) {
        console.log('[warning]: Double evaluation with function: ' + f.name);
        console.log('\t@' + iidToLocation(iid));
      } else if (f === SET_INTERVAL || f === SET_TIMEOUT) {
        if (args && args[0] && (typeof args[0]) === 'string') {
          console.log('[warning]: Double evaluation with function: ' + f.name);
          console.log('\t@' + iidToLocation(iid));
          console.log('\t[Suggestion]: Should use function as argument rather than a string code');
        }
      }
    }

    function instrumentCode(iid, code) {
      console.log('[warning]: Double evaluation with function: eval');
      console.log('\t@' + iidToLocation(iid));
      return code;
    }

    sandbox.invokeFunPre = invokeFunPre;
    sandbox.instrumentCode = instrumentCode;
})(J$.analysis));
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
    var IS_NAN = isNaN;
    var threshold = 50; // time interval is 50ms

    // before invoking a function/method
    function invokeFunPre(iid, f, base, args, isConstructor) {
      if (f === SET_INTERVAL) {
        if (args[1]) {
          var timeInterval = parseInt(args[1]);
          if (!IS_NAN(timeInterval)) {
            if (timeInterval <= 50) {
              console.log('[warning] call setInterval with interval ' + timeInterval + ' ms (less than ' + threshold + ' ms)');
            }
          }
        }
      }
    }

    sandbox.invokeFunPre = invokeFunPre;
})(J$.analysis));
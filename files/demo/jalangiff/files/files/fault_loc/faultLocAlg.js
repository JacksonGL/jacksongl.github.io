/* fault localization algorithm code*/
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

((function (module) {

  module.setFaultLocAlgorithm(Ochiai); // select the algorithm
  
  // Ochiai algorithm
  function Ochiai(nef, nep, nnf, nnp, orderedIIDs) {
    var scores = [];
    for (var k = 0; k < orderedIIDs.length; k++) {
      var iid = orderedIIDs[k];
      var score = nef[iid] / (Math.sqrt((nef[iid] + nnf[iid]) * (nef[iid] + nep[iid])));
      if (isNaN(score))
        score = 0;
      scores[iid] = score;
    }
    var result = scale(scores);
    return result;
  }
  
  
  
  function normalize(scores) {
    var total = 0;
    for(var i=0;i<scores.length;i++) {
      if(typeof scores[i] === 'number') {
        total += scores[i];
      }
    }
    
    for(var i=0;i<scores.length;i++) {
      if(typeof scores[i] === 'number') {
        scores[i] /= total;
      }
    }
    
    return scores;
  }
  
  function scale(scores) {
    var min = 1;
    var max = 0
    for(var i=0;i<scores.length;i++) {
      if(typeof scores[i] === 'number' && scores[i] !== 0) {
        if(min > scores[i]) min = scores[i];
        if(max < scores[i]) max = scores[i];
      }
    }
    
    for(var i=0;i<scores.length;i++) {
      if(typeof scores[i] === 'number' && scores[i] !== 0) {
        scores[i] -= min;
        if((max-min)===0){
            scores[i] = 1;
        } else {
            scores[i] /= (max - min);
        }
        scores[i] += 0.1;
      }
    }
    
    return scores;
  }
  
})(faultLocCore));
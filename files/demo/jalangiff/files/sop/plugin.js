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

((function (sandbox){
  var iidToLocation = function (iid) {
    if (window.getLocationFromIID) {
      return window.getLocationFromIID(iid);
    } else {
      return '[iid]: ' + iid;
    }
  }
  
  var blackList = {
    "contentDocument": true
    // this list can be extended
  };
  
  function testSameOrigin(url) {
    var loc = window.location,
      a = document.createElement('a');
      a.href = url;
    return a.hostname == loc.hostname &&
      a.port == loc.port &&
      a.protocol == loc.protocol;
  }
  function warning(iid) {
    console.log('[warning]:    accessing iframe from' + 
        ' different origin @' + iidToLocation(iid));
  }
  // during retrieving field from an entity
  function getFieldPre (iid, base, offset) {
    if(base instanceof HTMLIFrameElement 
         && blackList.hasOwnProperty(offset)) {
      if(base.contentDocument === null) {
        warning(iid);
      } else if (testSameOrigin(base.contentDocument.domain)) {
        warning(iid);
      }
    }
  }
  sandbox.getFieldPre = getFieldPre;
})(J$.analysis));
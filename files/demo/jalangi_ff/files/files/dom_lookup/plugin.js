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
  var id_dom_obj_map = {};
  var GET_ELEM_BY_ID = document.getElementById;
  function getLocation(iid) {
    if(window.getLocationFromIID){
      return window.getLocationFromIID(iid);
    } else {
      return '[iid]: ' + iid;
    }
  }

  // during invoking a function/method
  // val is the return value and should be returned
  function invokeFun (iid, f, base, args, val, isConstructor) {
    if(f === GET_ELEM_BY_ID){
      var id = args[0];
      if(!id_dom_obj_map[id]){
        id_dom_obj_map[id] = val;
      } else if(id_dom_obj_map[id] === val) {
        console.log('redundant document.getElementById with id: ' + id);
        console.log('\tloc: ' + getLocation(iid));
      }
    }
    return val;
  }

  sandbox.invokeFun = invokeFun;
})(J$.analysis));
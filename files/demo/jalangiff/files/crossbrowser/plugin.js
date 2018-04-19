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

((function (sandbox) {
    function invokeFunPre(iid, f, base, args) {
        if (base && base instanceof HTMLElement &&
            f && f.name === 'compareDocumentPosition') {
            // generate warnings
            console.log("[iid: " + iid + "] use of element.compareDocumentPosition() \n\t Not supported by IE 5.5, 6, 7");
        }
    }
    sandbox.invokeFunPre = invokeFunPre;
})(J$.analysis));
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

function smoosh(array) {
    var baseIdx = 0,
    toIdx = 1,
    fromIdx = 1;
    for (var i = 1; i < array.length; i++) {
        array[toIdx] = array[fromIdx];
        if (array[baseIdx] !== array[toIdx]) {
            baseIdx++;
            toIdx++;
        }
        fromIdx++;
    }
    while (toIdx < array.length) {
        array[toIdx] = -1;
        toIdx++;
    }
}

var N = 40, i;
var array = [];
for (var i = 0; i < N; i++) {
    array[i] = J$.readInput(0, 1, 4);
}

smoosh(array);

console.log(JSON.stringify(array));
J$.setOutput(array);

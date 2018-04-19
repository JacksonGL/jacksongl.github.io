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

var N = 4, i;
var array = [];

for (i = 0; i < N; i++) {
	array[i] = i;
	array[i] = J$.readInput(array[i]);
}

function compare(a, b) {
  if (a < b) {
     return -1;
  }
  if (a > b) {
     return 1;
  }
  return 0;
}

array = array.sort(compare);
console.log(JSON.stringify(array));
J$.setOutput(array);
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

var qsort = {};
((function (module){
    function quickSort(a, low, high) {
        if (high > low) {
            var index = randomInt(low, high);
            index = partition(a, index, low, high);
            quickSort(a, low, index - 1);
            quickSort(a, index + 1, high);
        }
        return a;
    }

    function swap(array, i, j) {
        var tmp = array[i];
        array[i] = array[j];
        array[j] = tmp;
    }

    function partition(a, index, low, high) {
        swap(a, low, index);
        index = low;
        low = low++;
        while (low < high) {
            while (a[low] <= a[index] && low < high) {
                low++;
            }
            while (a[high] >= a[index] && low < high) {
                high--;
            }
            if (low === high) {
                if (a[low] >= a[index]) {
                    swap(a, low - 1, index);
                    return low - 1;
                } else {
                    swap(a, low, index);
                    return low;
                }
            }
            if (low < high && a[low] > a[index] && a[high] < a[index]) {
                swap(a, low, high);
            } else if (a[low] < a[index] && a[high] < a[index]) {
                swap(a, low, index);
                swap(a, low, high);
                return high;
            }
        }
    }

    function randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    module.sort = quickSort;
})(qsort));

// create test harness
var N = 4, i;
var array = [];

for (i = 0; i < N; i++) {
    array[i] = i;
    array[i] = J$.readInput(array[i]);
}
var array = qsort.sort(array, 0, array.length - 1);
console.log(JSON.stringify(array));

// set output for comparison
J$.setOutput(array);

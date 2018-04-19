/* Target code to be transformed and analysed */
/* Do not put code here that will not terminate :) */

Math.max = function (a, b) {
    if (a < b) {
        return b;
    } else {
        return a;
    }
}

var MATH_RANDOM = Math.random;

Math.random = function () {
    return MATH_RANDOM();
}

var a = 1;

// read variable a
var b = a + 2;

// read object console
// read variable b
console.log(b);

var b = 0;
for (var i = 0; i < 100; i++) {
    b = Math.max(i, Math.random() * 10);
}

console.log(b);

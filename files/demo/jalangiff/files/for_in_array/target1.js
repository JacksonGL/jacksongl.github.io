// bad programming practices that uses for-in over array

var sum = 0, value;
// extending the array prototype
Array.prototype.fun = function () {};
var array = [11, 22, 33];
var obj = array;

for (value in obj) {
    sum += value;
}
console.log("sum: " + sum);
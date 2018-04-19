// bad programming practices that uses double evaluation

var result = eval('1+2');  // double evaluation
console.log('result: ' + result);

var result2 = (new Function('a','b','return a+b;'))(3,4);
console.log('result2: ' + result2); // double evaluation

var tmp;
setTimeout('tmp = 3;',0); // double evaluation

setInterval('tmp++', 100); // double evaluation
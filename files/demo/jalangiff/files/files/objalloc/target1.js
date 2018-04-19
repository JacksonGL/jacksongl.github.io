/* Target code to be transformed and analysed */
/* Do not put code here that will not terminate :) */
var a = {'field1': 'value1'}; // an object was allocated but never used
var b = new Object();
b.name = 'object b';
console.log(b.name);
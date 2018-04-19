/* Target code to be transformed and analysed */
/* Do not put code here that will not terminate :) */

var re1 = /test/i;
var re2 = new RegExp('test','i');

var patt1=new RegExp("e");
console.log(patt1.test("The best things in life are free"));

var patt2=new RegExp("f");
console.log(patt2.exec("The best things in life are free"));
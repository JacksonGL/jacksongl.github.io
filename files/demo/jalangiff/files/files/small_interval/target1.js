/* Target code to be transformed and analysed */
/* Do not put code here that will not terminate :) */
function fn () {
  // do nothing
}

var flag1 = setInterval(fn, 10000);
var flag2 = setInterval(fn, 15);

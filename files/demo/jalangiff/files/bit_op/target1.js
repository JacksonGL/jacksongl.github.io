/* Target code to be transformed and analysed */
/* Do not put code here that will not terminate :) */

var startTime = new Date();

var x = 0;
for(var i=0;i<200000;i++) {
	if(i%2) { // slow code, refactor to if(!(i&1))
		x++;
	}
}

var endTime = new Date();
console.log('time: ' + (endTime - startTime)/1000 + 's');
console.log(x);
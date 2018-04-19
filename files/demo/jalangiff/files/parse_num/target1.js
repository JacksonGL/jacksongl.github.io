/* Target code to be transformed and analysed */
/* Do not put code here that will not terminate :) */

var parseTime = function (timeString) {
    var parts = timeString.split(':');
	return { hour: parseInt(parts[0]), minute: parseInt(parts[1]) };
}

// On Safari, the console output would be:
// { hour: 10, minute: 0 } instead of { hour: 10, minute: 9 }
var ret = parseTime('10:09');
console.log('result: ' + JSON.stringify(ret));
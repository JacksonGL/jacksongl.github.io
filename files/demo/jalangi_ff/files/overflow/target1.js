
// an example that leads to overflow
var x = 1/0;

// another example that leads to overflow
var y = 2 * Number.MAX_VALUE;

var z = 0, i = 0;
// parse function leads to underflow
for (i=0;i<100;i++) {
  z += parseFloat('-5e5000');
}
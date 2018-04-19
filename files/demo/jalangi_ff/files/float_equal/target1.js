// It is a notorious fact that 0.1 + 0.2 !== 0.3 
// for most programming languages:
console.log('In JavaScript: 0.1 + 0.2 === 0.3 evaluates to ' 
            + (0.1 + 0.2 === 0.3) + '!');

// unaware of the float precision issue could lead
// to bugs and program looping forever!
var i;
for (var i = 0; i !== 1.7; i+= 0.01) {
  if(i > 10) break;
}
console.log('final value of i is ' + i);

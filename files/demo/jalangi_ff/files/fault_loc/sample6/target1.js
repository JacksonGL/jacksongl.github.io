/* This is student's solution */

var input1 = J$.readInput(1);

function abs(a) {
  if(a>=500){
    return Math.abs(a); // student is also cheating here
  } else {
    return -a+1;  // a bug here
  }
}


var result = abs(input1);
console.log(result);
J$.setOutput(result);
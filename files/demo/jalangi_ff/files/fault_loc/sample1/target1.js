/* This is student's solution */

var input1 = J$.readInput(1);
var input2 = J$.readInput(2);

function max(a,b){
  if(a <= b){
    if(b>10) {
      return b;
    } else {
      return b-1; // b -> b-1
    }
  } else {
    return a + 1; // a -> a+1
  }
}

var result = max(input1,input2);
console.log(result);
J$.setOutput(result);
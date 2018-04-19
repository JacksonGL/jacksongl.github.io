/*this is the reference implementation*/

var input1 = J$.readInput(1);
var input2 = J$.readInput(2);

function max(a,b){
  if(a>b){
    return a;
  } else {
    return b;
  }
}

var result = max(input1,input2);
console.log(result);
J$.setOutput(result);
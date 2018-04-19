/* Target code to be transformed and analysed */

function f(a, b) {
  // rewriting causes unnecessary 
  // opertions to the arguments object
  // this makes the JIT-compiler hard 
  // to perform optimization
  arguments[0] = 1;
  return a + b;
}

// this is a better way to 
// implement function f
function f2(_a, b) {
  var a = a;
  a = 1;
  return a + b;
}

console.log(f(3,2));
console.log(f2(3,2));
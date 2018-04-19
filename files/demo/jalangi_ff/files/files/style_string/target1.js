/* Target code to be transformed and analysed */
/* Do not put code here that will not terminate :) */

if(document.body.style === 'width: 100%') { // meaningless
  // do something
} else {
  // do something else
}

// setting a value without unit is not safe across browsers
document.createElement('div').style.width = 500;
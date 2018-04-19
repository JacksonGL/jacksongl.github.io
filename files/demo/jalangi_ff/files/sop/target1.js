/* Target code to be transformed and analysed */

// get the Wikipedia iframe element in this page
var iframe = $('#exampleIframe').get(0);

// Attempt to access the DOM of the subframe from
// a different origin. 
console.log(iframe.contentDocument);
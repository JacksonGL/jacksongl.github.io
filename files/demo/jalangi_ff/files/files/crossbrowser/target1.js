/* Target code to be transformed and analysed */
/* Do not put code here that will not terminate :) */
// Sample code copied from MDN:
// https://developer.mozilla.org/en-US/docs/Web/API/Node.compareDocumentPosition

var head = document.getElementsByTagName('head').item(0);
if (head.compareDocumentPosition(document.body) & Node.DOCUMENT_POSITION_FOLLOWING) {
  console.log("well-formed document");
} else {
  console.log("<head> is not before <body>");
}
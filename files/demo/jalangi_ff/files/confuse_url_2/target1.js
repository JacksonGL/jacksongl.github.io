/* Target code to be transformed and analysed */

// Suppose hacker has injected the following code
// into the current webpage by Cross-site Scripting (XSS).
// Oops! Injected JavaScript code tries to trick
// you to Bing but the link looks like going to Google!
window.location = 
  "http://www.google.com" + "\u2044" + "www.bing.com";
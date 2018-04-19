/* Target code to be transformed and analysed */

// Suppose hacker has injected the following code
// into the current webpage by Cross-site Scripting (XSS).
// Oops! Injected JavaScript code tries to trick
// you to Bing but the link looks like going to Google!
window.location = 
  'http://www.google.com&search_query=ras+bodik+computer+s'
  + 'cneince+164&q=test@www.bing.com/search?q=berkeley&qs=n'
  + '&form=QBLH&pq=berkeley&sc=8-8&sp=-1&sk=&cvid=09f4184817'
  + 'cb4850a70342ae9b3b072d ';
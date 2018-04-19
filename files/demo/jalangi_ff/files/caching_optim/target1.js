/* Target code to be transformed and analysed */
/* Do not put code here that will not terminate :) */

var a = {b: {c: {d: {cnt: 0}}}};

// non-redundant property retrieving
var e = a.b; 

// inefficient code pattern
for(var i=0;i<10000;i++) {
	a.b.c.d.cnt++;  
}

// efficient code pattern
var localCnt = a.b.c.d.cnt;
for(var i=0;i<10000;i++) {
	localCnt++;  
}
a.b.c.d.cnt = localCnt;



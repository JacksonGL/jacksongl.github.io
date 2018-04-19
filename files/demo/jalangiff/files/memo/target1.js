/* Target code to be transformed and analysed */
/* Do not put code here that will not terminate :) */
function isPrime1(n) {
	if (isNaN(n) || !isFinite(n) || n%1 || n<2) return false; 
	var m=Math.sqrt(n);
	for (var i=2;i<=m;i++) if (n%i==0) return false;
	return true;
}

for(var i=0;i<2000;i++){
	isPrime1(parseInt(Math.random()*100));
}
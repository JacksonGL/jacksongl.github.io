// code copied from the following website:
// http://www.nczonline.net/blog/2012/11/27/computer-science-in-javascript-quicksort/
// https://gist.github.com/vaibhavtolia/6747303

function quickSort(a, low, high) {

	if (high > low) {
		var index = getRandomInt(low, high);
		//console.log(low,high,index);
		var pivot = a[index];
		//console.log("pivot",pivot);
		a = partition(a, pivot);
		//console.log(a);
		quickSort(a, low, index - 1);
		quickSort(a, index + 1, high);
	}

	return a;
}

function partition(a, pivot) {
	var i = 0;
	for (var j = 0; j < a.length; j++) {
		if (a[j] != pivot && a[j] < pivot) {
			var temp = a[i];
			a[i] = a[j];
			a[j] = temp;
			i++;
		}
	}
	return a;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

var N = 4, i;
var array = [];

for (i = 0; i < N; i++) {
	array[i] = i;
	array[i] = J$.readInput(array[i]);
}
var array = quickSort(array, 0, array.length - 1);
console.log(JSON.stringify(array));
J$.setOutput(array);
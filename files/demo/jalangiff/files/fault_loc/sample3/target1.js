// code copied from the following website:
// http://www.nczonline.net/blog/2012/11/27/computer-science-in-javascript-quicksort/
// https://gist.github.com/springuper/4182296

function swap(items, firstIndex, secondIndex) {
	var temp = items[firstIndex];
	items[firstIndex] = items[secondIndex];
	items[secondIndex] = temp;
}

function partition(items, left, right) {
	var index = Math.floor((right + left) / 2),
	pivot = items[index],
	i = left,
	j = right;
	while (i < j) { // i <= j to i < j
		while (items[i] < pivot) {
			i++;
		}
		while (items[j] > pivot) {
			j--;
		}
		if (i < j) { // i <=j to i < j
			swap(items, i, j);
			if (i === index) {
				index = j;
			} else if (j === index) {
				index = i;
			}
			i++;
			j--;
		}
	}
	return index;
}

function quickSort(items, left, right) {
	var index;
	if (items.length > 1) {
		index = partition(items, left, right);
		if (left < index - 1) {
			// the bug we found are here (index -> index - 1)
			quickSort(items, left, index - 1); 
		}
		if (index + 1 < right) {
			quickSort(items, index + 1, right);
		}
	}
	return items;
}

var N = 4, i;
var array = [];

for (i = 0; i < N; i++) {
	array[i] = i;
	array[i] = J$.readInput(array[i]);
}
var array = quickSort(array, 0, array.length-1);
console.log(JSON.stringify(array));
J$.setOutput(array);
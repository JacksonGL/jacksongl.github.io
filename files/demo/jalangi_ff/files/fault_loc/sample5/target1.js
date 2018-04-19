// copied from:
// http://dave.dkjones.org/posts/2014/js-quicksort.html

function medianOfThree(a, b, c) {
	if (a >= b && b >= c) {
		return b;
	} else if (a >= c && c >= b) {
		return c;
	} else if (b >= a && a >= c) {
		return a;
	} else if (b >= c && c >= a) {
		return c;
	} else if (c >= a && a >= b) {
		return a;
	} else {
		return b;
	}
}
function qsort1(xs, start, end) {
	start = start || 0;
	if (end === undefined) {
		end = xs.length;
	}

	if (end < start + INSERT_SORT_THRESHOLD) {
		isort(xs, start, end);
		return xs;
	}

	var i = start - 1,
	j = end,
	// pidx = Math.floor(Math.random() * (end - start)) + start,
	pivot = medianOfThree(xs[start],
			xs[Math.floor((start + end) / 2)],
			xs[end - 1]),
	t;
	while (i < j) {
		i += 1;
		while (i < j && xs[i] < pivot) {
			i += 1;
		}

		j -= 1;
		while (i < j && pivot < xs[j]) {
			j -= 1;
		}

		if (i < j) {
			t = xs[i];
			xs[i] = xs[j];
			xs[j] = t;
		}
	}
	if (xs[i] < pivot) {
		throw 'invariant';
	}

	qsort1(xs, start, i);
	qsort1(xs, i, end);
	return xs;
}
var N = 4, i;
var array = [];

for (i = 0; i < N; i++) {
	array[i] = i;
	array[i] = J$.readInput(array[i]);
}

array = qsort1(array, 0, array.length - 1);
console.log(JSON.stringify(array));
J$.setOutput(array);
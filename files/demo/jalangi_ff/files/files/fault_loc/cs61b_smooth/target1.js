/**
 *  smoosh() takes an array of ints.  On completion the array contains
 *  the same numbers, but wherever the array had two or more consecutive
 *  duplicate numbers, they are replaced by one copy of the number.  Hence,
 *  after smoosh() is done, no two consecutive numbers in the array are the
 *  same.
 *
 *  Any unused elements at the end of the array are set to -1.
 *
 *  For example, if the input array is [ 0 0 0 0 1 1 0 0 0 3 3 3 1 1 0 ],
 *  it reads [ 0 1 0 3 1 0 -1 -1 -1 -1 -1 -1 -1 -1 -1 ] after smoosh()
 *  completes.
 *
 *  @param ints the input array.
 **/

function smoosh(array) {
    var baseIdx = 0,
    toIdx = 1,
    fromIdx = 1;
    for (var i = 1; i < array.length; i++) {
        array[toIdx] = array[fromIdx];
        if (array[baseIdx] !== array[toIdx]) {
            baseIdx++;
            toidx++; // seeded bug: typo 'toIdx' -> 'toidx'
        }
        fromIdx++;
    }
    while (toIdx < array.length) {
        array[toIdx] = -1;
        toIdx++;
    }
}

var N = 40, i;
var array = [];
for (var i = 0; i < N; i++) {
    array[i] = J$.readInput(0, 1, 4);
}

smoosh(array);

console.log(JSON.stringify(array));
J$.setOutput(array);

  /**
   *  squish() takes this list and, wherever two or more consecutive items are
   *  equals(), it removes duplicate nodes so that only one consecutive copy
   *  remains.  Hence, no two consecutive items in this list are equals() upon
   *  completion of the procedure.
   *
   *  After squish() executes, the list may well be shorter than when squish()
   *  began.  No extra items are added to make up for those removed.
   *
   *  For example, if the input list is [ 0 0 0 0 1 1 0 0 0 3 3 3 1 1 0 ], the
   *  output list is [ 0 1 0 3 1 0 ].
   *
   *  IMPORTANT:  Be sure you use the equals() method, and not the "=="
   *  operator, to compare items.
  **/

function squish(array) {
    var baseIdx = 0,
    toIdx = 1,
    fromIdx = 1;
    // seeded bug: "i = 1" -> "i = 2"
    for (var i = 2; i < array.length; i++) { 
        array[toIdx] = array[fromIdx];
        if (array[baseIdx] !== array[toIdx]) {
            baseIdx++;
            toIdx++;
        }
        fromIdx++;
    }
    array.length = toIdx;
}

var N = 40, i;
var array = [];
for (var i = 0; i < N; i++) {
    array[i] = J$.readInput(0, 1, 4);
}

squish(array);

console.log(JSON.stringify(array));
J$.setOutput(array);
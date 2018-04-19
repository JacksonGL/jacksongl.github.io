/**
   *  twin() takes this list and doubles its length by replacing each node
   *  with two consecutive nodes referencing the same item.
   *
   *  For example, if the input list is [ 3 7 4 2 2 ], the
   *  output list is [ 3 3 7 7 4 4 2 2 2 2 ].
   *
   *  IMPORTANT:  Do not try to make new copies of the items themselves.
   *  Make new SListNodes, but just copy the references to the items.
   **/

function twin(array) {
    var len = array.length;
    for (var i = len - 1; i>=0; i--) {
        array[i*2] = array[i*2 + 1] = array[i];
    }
}

var N = 6, i;
var array = [];
for (var i = 0; i < N; i++) {
    array[i] = J$.readInput(0, -500, 500);
}

twin(array);

console.log(JSON.stringify(array));
J$.setOutput(array);
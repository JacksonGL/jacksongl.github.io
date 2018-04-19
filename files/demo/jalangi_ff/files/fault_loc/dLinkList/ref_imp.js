/* this is the reference implementation */
// code copied from http://www.nczonline.net/blog/2009/04/21/computer-science-in-javascript-doubly-linked-lists/

function DoublyLinkedList() {
    this._length = 0;
    this._head = null;
    this._tail = null;
}

DoublyLinkedList.prototype = {
    add : function (data) {
        //create a new item object, place data in
        var node = {
            data : data,
            next : null,
            prev : null
        };

        //special case: no items in the list yet
        if (this._length == 0) {
            this._head = node;
            this._tail = node;
        } else {

            //attach to the tail node
            this._tail.next = node;
            node.prev = this._tail;
            this._tail = node;
        }

        //don't forget to update the count
        this._length++;

    },
    remove : function (index) {
        //check for out-of-bounds values
        if (index > -1 && index < this._length) {
            var current = this._head,
            i = 0;
            //special case: removing first item
            if (index === 0) {
                this._head = current.next;
                /*
                 * If there's only one item in the list and you remove it,
                 * then this._head will be null. In that case, you should
                 * also set this._tail to be null to effectively destroy
                 * the list. Otherwise, set the previous pointer on the
                 * new this._head to be null.
                 */
                if (!this._head) {
                    this._tail = null;
                } else {
                    this._head.prev = null;
                }
                //special case: removing last item
            } else if (index === this._length - 1) {
                current = this._tail;
                this._tail = current.prev;
                this._tail.next = null;
            } else {
                //find the right location
                while (i++ < index) {
                    current = current.next;
                }
                //skip over the item to remove
                current.prev.next = current.next;
            }
            //decrement the length
            this._length--;
            //return the value
            return current.data;
        } else {
            return null;
        }
    }
};
var input1 = J$.readInput(1);
var input2 = J$.readInput(2);

var list = new DoublyLinkedList();
var N = 30;
for (var i = 0; i < N; i++) {
    list.add(J$.readInput(i));
}

var result = [];
var n = N;
for (var i = 0; i < N; i++) {
    result.push(list.remove(J$.readInput(n - 1, 0, n - 1)));
    n--;
}
console.log(result);
J$.setOutput(result);
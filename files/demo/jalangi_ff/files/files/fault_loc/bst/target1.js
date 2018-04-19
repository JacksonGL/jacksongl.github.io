
/*
 * License:
 *
 * Copyright (c) 2011 Trevor Lalish-Menagh (http://www.trevmex.com/)
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
// a bug is seeded to demonstrate bug localization
var BST = function () {
    var Node = function (leftChild, key, value, rightChild, parent) {
        return {
            leftChild : (typeof leftChild === "undefined") ? null :
            leftChild,
            key : (typeof key === "undefined") ? null : key,
            value : (typeof value === "undefined") ? null : value,
            rightChild : (typeof rightChild === "undefined") ? null :
            rightChild,
            parent : (typeof parent === "undefined") ? null : parent
        };
    },

    root = new Node(),
    searchNode = function (node, key) {
        if (node.key === null) {
            return null;
        }

        var nodeKey = parseInt(node.key, 10);

        if (key < nodeKey) {
            return searchNode(node.leftChild, key);
        } else if (key >= nodeKey) { // seeded bug: '>' -> '>='
            return searchNode(node.rightChild, key);
        } else {
            return node.value;
        }
    },
    insertNode = function (node, key, value, parent) {
        if (node.key === null) {
            node.leftChild = new Node();
            node.key = key;
            node.value = value;
            node.rightChild = new Node();
            node.parent = parent;
            return true;
        }

        var nodeKey = parseInt(node.key, 10);

        if (key < nodeKey) {
            insertNode(node.leftChild, key, value, node);
        } else if (key > nodeKey) {
            insertNode(node.rightChild, key, value, node);
        } else {
            node.value = value;
            return true;
        }
    },
    traverseNode = function (node, callback) {
        if (node.key !== null) {
            traverseNode(node.leftChild, callback);
            callback(node.key, node.value);
            traverseNode(node.rightChild, callback);
        }

        return true;
    },
    minNode = function (node) {
        while (node.leftChild.key !== null) {
            node = node.leftChild;
        }

        return node.key;
    },
    maxNode = function (node) {
        while (node.rightChild.key !== null) {
            node = node.rightChild;
        }

        return node.key;
    },
    successorNode = function (node) {
        var parent;

        if (node.rightChild.key !== null) {
            return minNode(node.rightChild);
        }

        if (node.parent === null)
            return null;

        parent = node.parent;
        while (parent.key !== null && node == parent.rightChild) {
            node = parent;
            parent = parent.parent;
        }

        return parent.key;
    },
    predecessorNode = function (node) {
        var parent;

        if (node.leftChild.key !== null) {
            return maxNode(node.leftChild);
        }

        if (node.parent === null)
            return null;

        parent = node.parent;
        while (parent.key !== null && node == parent.leftChild) {
            node = parent;
            parent = parent.parent;
        }

        return parent.key;
    };

    return {
        search : function (key) {
            var keyInt = parseInt(key, 10);

            if (isNaN(keyInt)) {
                return undefined; // key must be a number
            } else {
                return searchNode(root, keyInt);
            }
        },
        insert : function (key, value) {
            var keyInt = parseInt(key, 10);

            if (isNaN(keyInt)) {
                return undefined; // key must be a number
            } else {
                return insertNode(root, keyInt, value, null);
            }
        },
        traverse : function (callback) {
            if (typeof callback === "undefined") {
                callback = function (key, value) {
                    print(key + ": " + value);
                };
            }

            return traverseNode(root, callback);
        },
        min : function () {
            return minNode(root);
        },
        max : function () {
            return maxNode(root);
        },
        successor : function () {
            return successorNode(root);
        },
        predecessor : function () {
            return predecessorNode(root);
        }
    };
};

var result = [];
var ipTree = new BST();
var N = 10;
for (var i = 0; i < N; i++) {
    var value = J$.readInput(i, 0, 100);
    ipTree.insert(value, 'data-' + value);
}

result.push(ipTree.search(J$.readInput(0, 1, 15)))
result.push(ipTree.min());
result.push(ipTree.max());
result.push(ipTree.successor());
result.push(ipTree.predecessor());

ipTree.traverse(function (key, value) {
    result.push(key);
});

J$.setOutput(result);
console.log(JSON.stringify(result));
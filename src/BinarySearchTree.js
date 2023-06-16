//Import the Queue for the breadth-first search
const Queue = require("./Queue");

//BinarySearchTrees-BST has the following characteristics: each node in a BST hold a key, a value, a left pointer, a right pointer, which points to child nodes.
//Each node has a parent unless it's the root node.

//This constructor represents a single node in the tree.
//You can optionally pass in a key, a value, and a pointer to the parent node.
//If the key property is null, then the object represents an empty tree.
//If the parent pointer is null, you are dealing with a root node.
//The node starts with the left and right pointers to their child nodes being null.
//BST -BinarySearchTrees
class BinarySearchTree {
	constructor(key = null, value = null, parent = null) {
		this.key = key;
		this.value = value;
		this.parent = parent;
		this.left = null;
		this.right = null;
	}

	//BSTs support three fundamental operations: insert(), find(), and remove()
	//BSTs tend to be recursive in nature

	insert(key, value) {
		//if the tree is empty, then this key being inserted is the root node
		if (this.key == null) {
			this.key = key;
			this.value = value;
		} else if (key < this.key) {
			/* If the tree already exists, then start at the root, and compare it to the key you want to insert.
    If the new key < node's key, then the new node needs to live in the left-hand branch */
			/* If the existing node does not have a left child (left pointer is empty), then instantiate and insert the new node as the left child of that node, pass "this" as the parent. */
			if (this.left == null) {
				this.left = new BinarySearchTree(key, value, this);
			} else {
				/* If the node has an existing left child, recursively call the insert() method
      so that the node will be inserted further down the tree. */
				this.left.insert(key, value);
			}
		} else {
			/* Similarly, if the new key is greater than the node's key, then you do the same thing, but on the right-hand side. */
			if (this.right == null) {
				this.right = new BinarySearchTree(key, value, this);
			} else {
				this.right.insert(key, value);
			}
		}
	}
	//Create the find() method
	find(key) {
		//If the item is found at the root, return that value
		if (this.key == key) {
			return this.value;
		} else if (key < this.key && this.left) {
			/* If the item you are looking for is less than the root, follow the left child. If there is an existing left child, recursively check its left and/or right child until you fin the item */
			return this.left.find(key);
		} else if (key > this.key && this.right) {
			/* If the item that you are looking for is greater than the root, then follow the right child. 
    If there is an existing right child, then recursively check its left and/ or right child until you find the item. */
			return this.right.find(key);
		}
		//If you have searched the tree and the item isn't in the tree.
		else {
			throw new Error("Key Not Found");
		}
	}
	//add a remove() method
	remove(key) {
		if (this.key == key) {
			if (this.left && this.right) {
				const successor = this.right._findMin();
				this.key = successor.key;
				this.value = successor.value;
				successor.remove(successor.key);
			} else if (this.left) {
				/* If the node only has a left child, replace the left node with its left child. */
				this._replaceWith(this.left);
			} else if (this.right) {
				/* If the node only has a right child, replace the node with its right child. */
				this._replaceWith(this.right);
			} else {
				/* If the node has no children, remove it and any reference to it by calling `this._replaceWith(null)` */
				this._replaceWith(null);
			}
		} else if (key < this.key && this.left) {
			this.left.remove(key);
		} else if (key > this.key && this.right) {
			this.right.remove(key);
		} else {
			throw new Error("Key Not Found");
		}
	}
	/* HELPER FUNCTIONS USED WHEN REMOVING A NODE
  _replaceWith() - used to find the node you want to use to replace a node that has children. If the node you are replacing has a parent node, wire up the references from the parent to the replacement node and the replacement node back to the parent. If the node is a root node, copy over the properties of the replacement node. */
	_replaceWith(node) {
		if (this.parent) {
			if (this == this.parent.left) {
				this.parent.left = node;
			} else if (this == this.parent.right) {
				this.parent.right = node;
			}
			if (node) {
				node.parent = this.parent;
			}
		} else {
			if (node) {
				this.key = node.key;
				this.value = node.value;
				this.left = node.left;
				this.right = node.right;
			} else {
				this.key = null;
				this.value = null;
				this.left = null;
				this.right = null;
			}
		}
	}
	/* _findMin() - used to find the minimum value from the right subtree. When you are removing a node form the tree that has two children, replace the node with the smallest node from the right subtree. */
	_findMin() {
		if (!this.left) {
			return this;
		}
		return this.left_findMin();
	}

	dfsInOrder(values = []) {
		//first, process the left node recursively
		if (this.left) {
			values = this.left.dfsInOrder(values);
		}
		//next, process the current node
		values.push(this.value);
		//finally, process the right node recursively
		if (this.right) {
			values = this.right.dfsInOrder(values);
		}
		return values;
	}

	dfsPreOrder(values = []) {
		//first, process the current node
		values.push(this.value);

		//next process the left node recursively
		if (this.lef) {
			values = this.left.dfsPreOrder(values);
		}

		//finally, process the right node recursively
		if (this.right) {
			values = this.right.dfsPreOrder(values);
		}
		return values;
	}

	dfsPostOrder(values = []) {
		//first process the left node recursively
		if (this.left) {
			values = this.left.dfsPostOrder(values);
		}
		//next process the right node recursively
		if (this.right) {
			values = this.right.dfsPostOrder(values);
		}
		//finally, process the current node
		values.push(this.value);
	}

	bfs(tree, values = []) {
		const queue = new Queue();
		/* start the traversal at the tree and add the tree node to the queue to kick off the BFS */
		queue.enqueue(tree);
		//remove from queue
		let node = queue.dequeue();
		while (node) {
			//add the value of the queue to an array
			values.push(node.value);
			//add the left child to the queue
			if (node.left) {
				queue.enqueue(node.left);
			}
			//add the right child to the queue
			if (node.right) {
				queue.enqueue(node.right);
			}
			node = queue.dequeue();
		}
		return values;
	}

	//GET the HEIGHT of a Binary Search Tree
	getHeight(currentHeight = 0) {
		//BASE CASE:
		//If the current node does not have a left or right child,
		//then the base case is reached, and the function can return the height
		if (!this.left && !this.right) return currentHeight;

		//RECURSIVE CASE:
		//otherwise, compute the new height
		const newHeight = currentHeight + 1;

		//If there's no left child, recurse down the right subtree only,
		//passing down the height of the current node.
		if (!this.left) return this.right.getHeight(newHeight);

		//If there's no right child recurse down the left subtree only,
		//passing down the height of the current node.
		if (!this.right) return this.left.getHeight(newHeight);

		// If both children exist, recurse down both subtrees,
		//passing down the height of the current node.
		const leftHeight = this.left.getHeight(newHeight);
		const rightHeight = this.right.getHeight(newHeight);
	}
}
/* COMPLEXITY ANALYSIS FOR INSERT()
With insertion you iterate to the height of the tree. 
Best case: You would be inserting the root only, O(1); 
Average case: nodes  are inserted equally on left an dright branches(balanced tree) O(log n)
Worst case, BST skews either to the left or the right, which is like a linked list. You have to iterate through each of thoe left and right nodes to get to the bottom of the tree to insert something O(n)*/

/* COMPLEXITY ANALYSIS FOR FIND()
Best case: node you are trying to find is in the root, O(1).
Average case: you traverse the height of a balanced tree, O(log n)
Worst case: tree is skewed right or left; you are searching for the node at the bottom where everything is inserted to one side, O(n). */

/* COMPLEXITY ANALYSIS FOR REMOVE()
similar to insertion and retrieval, with worst case being O(n) */

class Node {
  data;
  left;
  right;

  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }

  getChildren() {
    let nodes = [];
    if (this.hasLeft()) nodes.push(this.left);
    if (this.hasRight()) nodes.push(this.right);
    return nodes;
  }

  isLeaf() {
    return this.left === null && this.right === null;
  }

  hasLeft() {
    return this.left !== null;
  }

  hasRight() {
    return this.right !== null;
  }

  hasSingleChildNode() {
    return (
      (this.left === null && this.right !== null) ||
      (this.left !== null && this.right === null)
    );
  }
}

class Tree {
  root;

  constructor() {
    this.root = null;
    this.balanced = false;
  }

  buildTree(array) {
    let leftHalf = [...new Set(array.sort((a, b) => a - b))];
    let rightHalf = leftHalf.splice(Math.floor(leftHalf.length / 2));
    let node = new Node(rightHalf.shift());
    node.left = leftHalf.length > 0 ? this.buildTree(leftHalf) : null;
    node.right = rightHalf.length > 0 ? this.buildTree(rightHalf) : null;
    this.root = node;
    this.balanced = true;
    return node;
  }

  insert(data, node = this.root) {
    if (node === null) return false;
    if (data === node.data) return false;
    else if (data < node.data) {
      if (!node.hasLeft()) {
        node.left = new Node(data);
        return true;
      }
      return this.insert(data, node.left);
    } else {
      if (!node.hasRight()) {
        node.right = new Node(data);
        return true;
      }
      return this.insert(data, node.right);
    }
  }

  delete(data, node = this.root, parent = null, left = null) {
    if (node === null) return false;
    if (data === node.data) return this._deleteNode(node, left, parent);
    else if (data < node.data) return this.delete(data, node.left, node, true);
    else return this.delete(data, node.right, node, false);
  }

  find(value, node = this.root) {
    if (node === null) return null;
    if (node.data === value) return node;
    if (value < node.data) return this.find(value, node.left);
    return this.find(value, node.right);
  }

  // Breadth-First
  levelOrder(f = null, nodes = [this.root]) {
    if (nodes.length <= 0) return [];

    let queue = [];
    let levelOrderData = [];
    nodes.forEach((n) => {
      if (f !== null) f(n);
      levelOrderData.push(n.data);
      queue = queue.concat(n.getChildren());
    });
    return levelOrderData.concat(this.levelOrder(f, queue));
  }

  // Depth-First (DLR)
  preorder(f = null, node = this.root) {
    if (f !== null) f(node);
    let returnData = [node.data];
    if (node.hasLeft())
      returnData = returnData.concat(this.preorder(f, node.left));
    if (node.hasRight())
      returnData = returnData.concat(this.preorder(f, node.right));
    return returnData;
  }

  // Depth-First (LDR)
  inorder(f = null, node = this.root) {
    let returnData = [];
    if (node.hasLeft())
      returnData = returnData.concat(this.inorder(f, node.left));
    if (f !== null) f(node);
    returnData.push(node.data);
    if (node.hasRight())
      returnData = returnData.concat(this.inorder(f, node.right));
    return returnData;
  }

  // Depth-First (LRD)
  postorder(f = null, node = this.root) {
    let returnData = [];
    if (node.hasLeft())
      returnData = returnData.concat(this.postorder(f, node.left));
    if (node.hasRight())
      returnData = returnData.concat(this.postorder(f, node.right));
    if (f !== null) f(node);
    returnData.push(node.data);
    return returnData;
  }

  height(node) {
    const leftHeight = node.hasLeft() ? 1 + this.height(node.left) : 0;
    const rightHeight = node.hasRight() ? 1 + this.height(node.right) : 0;
    return Math.max(leftHeight, rightHeight);
  }

  depth(userNode) {
    let myNode = this.root;
    let count = 0;
    while (userNode.data !== myNode.data && myNode !== null) {
      if (userNode.data < myNode.data) myNode = myNode.left;
      else myNode = myNode.right;
      count += 1;
    }
    return count;
  }

  isBalanced() {
    const leftHeight = this.height(this.root.left);
    const rightHeight = this.height(this.root.right);
    return (
      Math.max(leftHeight, rightHeight) - Math.min(leftHeight, rightHeight) <= 1
    );
  }

  rebalance() {
    this.buildTree(this.inorder(null));
  }

  _deleteNode(node, left, parent) {
    if (node.isLeaf() && left !== null) {
      this._deleteLeafNode(parent, left);
    } else if (node.hasSingleChildNode()) {
      this._deleteSingleChildNode(parent, node, left);
    } else if (node.hasLeft() && node.hasRight()) {
      this._deleteDualChildNode(node, parent, left);
    }
    return true;
  }

  _deleteDualChildNode(node, parent, left) {
    let newParent = node.right;
    while (newParent.hasLeft()) newParent = newParent.left;
    newParent.left = node.left;

    if (parent === null) this.root = node.right;
    else parent[left ? "left" : "right"] = node.right;
  }

  _deleteSingleChildNode(parent, node, left) {
    if (parent === null) {
      this.root = node.hasOnlyLeft() ? node.left : node.right;
    } else {
      parent[left ? "left" : "right"] = node.hasOnlyLeft()
        ? node.left
        : node.right;
    }
  }

  _deleteLeafNode(parent, left) {
    parent[left ? "left" : "right"] = null;
  }
}

// Credit: Method `prettyPrint` is from The Odin Project
const prettyPrint = (node, prefix = "", isLeft = true) => {
  if (node.right !== null) {
    prettyPrint(node.right, `${prefix}${isLeft ? "│   " : "    "}`, false);
  }
  console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
  if (node.left !== null) {
    prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
  }
};

function logData(node) {
  console.log(node.data);
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomNumberArray(count) {
  const maxValue = count * 2;
  let returnValue = [];
  for (let i = 0; i < count; i++) {
    returnValue.push(getRandomInt(maxValue));
  }
  return returnValue;
}

// "Test Suite"
const dataSet = [
  1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324, 23, 23, 23, 24,
];

const initialNumberCount = 20;
const additionalNumberCount = 40;

// 1. Create an array of random numbers and use it to generate a tree.
const randomNumberArray = getRandomNumberArray(initialNumberCount);
const bst = new Tree();
bst.buildTree(randomNumberArray);
// prettyPrint(bst.root);

// 2. Confirm that the tree is balanced.
console.log(`Tree is ${bst.isBalanced() ? "balanced" : "unbalanced"}`);

// 3. Print out all elements in level, pre, post, and in order
//    For 10k numbers, this would be enormous. (skip)
let levelorder = bst.levelOrder();
let preorder = bst.preorder();
let inorder = bst.inorder();
let postorder = bst.postorder();
levelorder.sort();
preorder.sort();
inorder.sort();
postorder.sort();
if (
  levelorder.toString() === preorder.toString() &&
  levelorder.toString() === inorder.toString() &&
  levelorder.toString() === postorder.toString()
) {
  console.log(
    "Pass: Sorted arrays are equivalent: [levelorder = preorder = inorder = postorder]"
  );
}

// 4. Unbalance the tree by adding several numbers > 100
console.log(`Tree contains ${levelorder.length} numbers`);
console.log(
  `Inserting ${additionalNumberCount} new random numbers... (Some will be rejected)`
);
const newRandomNumbers = getRandomNumberArray(additionalNumberCount);
newRandomNumbers.forEach((n) => bst.insert(n + 100));

// 5. Confirm that the tree is unbalanced
console.log(`Tree is ${bst.isBalanced() ? "balanced" : "unbalanced"}`);
levelorder = bst.levelOrder();
console.log(`Tree now contains ${levelorder.length} numbers`);

// 6. Balance the tree
console.log("Balancing tree...");
bst.rebalance();

// 7. Confirm that the tree is balanced
console.log(`Tree is ${bst.isBalanced() ? "balanced" : "unbalanced"}`);

// 8. Print out all elements in level, pre, post, and in order
levelorder = bst.levelOrder();
preorder = bst.preorder();
inorder = bst.inorder();
postorder = bst.postorder();
console.log("levelorder: " + levelorder.toString());
console.log("  preorder: " + preorder.toString());
console.log("   inorder: " + inorder.toString());
console.log(" postorder: " + postorder.toString());
levelorder.sort();
preorder.sort();
inorder.sort();
postorder.sort();
if (
  levelorder.toString() === preorder.toString() &&
  levelorder.toString() === inorder.toString() &&
  levelorder.toString() === postorder.toString()
) {
  console.log(
    "Pass: Sorted arrays are equivalent: [levelorder = preorder = inorder = postorder]"
  );
}

// Show what the tree looks like
console.log("=================================== Show what the tree looks like")
prettyPrint(bst.root);

console.log("=================================== Delete the root node and print")
bst.delete(bst.root.data);
prettyPrint(bst.root);

console.log("=================================== Rebalance and display")
bst.rebalance();
prettyPrint(bst.root);


class Node {
  data;
  left;
  right;

  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }

  hasEmptyLeft() {
    return this.left === null;
  }
  hasEmptyRight() {
    return this.right === null;
  }
  hasOnlyLeft() {
    return this.left !== null && this.right === null;
  }
  hasOnlyRight() {
    return this.left === null && this.right !== null;
  }
  hasLeftAndRight() {
    return this.left !== null && this.right !== null;
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
    if (data === node.data) return false;
    else if (data < node.data) {
      if (node.hasEmptyLeft()) {
        node.left = new Node(data);
        return true;
      }
      return this.insert(data, node.left);
    } else {
      if (node.hasEmptyRight()) {
        node.right = new Node(data);
        return true;
      }
      return this.insert(data, node.right);
    }
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

// "Test Suite"
const dataSet = [
  1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324, 23, 23, 23, 24,
];
const dataSetEasy = [1, 2, 3, 5, 6, 7, 8];
const bst = new Tree();
bst.buildTree(dataSetEasy);
bst.insert(9);
bst.insert(10);
bst.insert(11);
bst.insert(12);
bst.insert(0);
bst.insert(9);
prettyPrint(bst.root);

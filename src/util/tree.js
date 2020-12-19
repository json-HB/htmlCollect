class Tree {
  constructor(tree) {
    this.root = null;
    const type = typeof tree;
    if (type == 'number') {
      this.insertNode(tree);
    } else if (Array.isArray(tree)) {
      this.batchCreateNode(tree);
    } else {
      throw Error('tree shoule be number or array type');
    }
  }
  insertNode(node) {
    const newNode = this.createNode(node);

    const _insert = function(node, newNode) {
      if (node.key > newNode.key) {
        if (node.left == null) {
          node.left = newNode;
        } else {
          _insert(node.left, newNode);
        }
      } else {
        if (node.right == null) {
          node.right = newNode;
        } else {
          _insert(node.right, newNode);
        }
      }
    };

    if (this.root === null) {
      this.root = this.createNode(newNode);
    } else {
      _insert(this.root, newNode);
    }
  }

  createNode(val) {
    const o = Object.create(null, {});
    o.left = null;
    o.right = null;
    o.key = val;
    return o;
  }
  batchCreateNode(tree) {
    tree.forEach(item => {
      this.insertNode(item);
    });
  }

  showTree() {
    return this.root;
  }
}

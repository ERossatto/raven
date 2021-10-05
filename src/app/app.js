/**
 * Constructs a file tree node.
 *
 * @constructor
 * @param {number} nodeId
 * @param {string} name
 * @param {string} type
 */
var FileTreeNode = function(nodeId, name, type) {
  var children = [];

  this.nodeId = nodeId;
  this.name = name;
  this.type = type;
  this.parentNode = null;

  /**
   * Sets a parent node and adds the child nodes.
   *
   * @param {object} parentNode
   * @return {void}
   */
  this.setParent = function(parentNode) {
    this.parentNode = parentNode;

    if (!parentNode.hasChild(this)) {
      parentNode.addChild(this);
    }
  };

  /**
   * Adds a child node.
   *
   * @param {object} node
   * @throw {string} if node.type is not 'DIRECTORY'
   * @throw {string} if note is already a child of this node
   * @return {array} children
   */
  this.addChild = function(node){
    if (this.type !== 'DIRECTORY') {
      throw "Cannot add child node to a non-directory node";
    }

    if (this.hasChild(node)) {
      throw "Specified node is already a child of this node";
    }

    children.push(node);
    node.setParent(this);
  };

  /**
   * Checks if the node is a child of this node.
   *
   * @param  {object}  node
   * @return {boolean} True if the node is a child of this node, false if not.
   */
  this.hasChild = function(node) {
    var count = children.length;
    for (var i = 0; i < count; i++) {
      if (children[i] === node) {
        return true;
      }
    }

    return false;
  };

  /**
   * Gets the children.
   *
   * @return {object} children
   */
  this.getChildren = function() {
    return children;
  };
};

/**
 * Constructs the file tree
 *
 * @constructor
 */
var FileTree = function() {
  this.nodes = [];

  /**
   * Gets the root nodes.
   *
   * @return {array} result
   */
  this.getRootNodes = function() {
    var result = [];
    for (var i=0; i<this.nodes.length; i++) {
      if (!this.nodes[i].parentNode) {
        result.push(this.nodes[i]);
      }
    }
    return result;
  };

  /**
   * Finds a node by it's ID.
   *
   * @param {number} nodeId
   * @return {mixed}
   */
  this.findNodeById = function(nodeId) {
    for (var i=0; i<this.nodes.length; i++) {
      if (this.nodes[i].nodeId === nodeId) {
        return this.nodes[i];
      }
    }
    return null;
  };

  /**
   * Creates a node.
   *
   * @param {number} nodeId
   * @param {string} name
   * @param {string} type
   * @param {object} parentNode
   * @return {void}
   */
  this.createNode = function(nodeId, name, type, parentNode) {
    var node = new FileTreeNode(nodeId, name, type);
    if (parentNode) {
      parentNode.addChild(node);
    }
    this.nodes.push(node);
  }
};

/**
 * Creates a file tree.
 *
 * @param {object} input
 * @returns {object} the FileTree instance.
 */
function createFileTree(input) {
  var fileTree = new FileTree();
  for (var it=0; it<input.length; it++) {
    var inputNode = input[it];
    var parentNode = inputNode.parentId ? fileTree.findNodeById(inputNode.parentId) : null;
    fileTree.createNode(inputNode.id, inputNode.name, inputNode.type,  parentNode);
  }
  return fileTree;
}

module.exports = createFileTree
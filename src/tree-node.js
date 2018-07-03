/**
 * TreeNode is a simple structure. It is defined
 * for generating tree.
 */
export default class TreeNode {

    constructor(level, content, parent) {
        this.level = level
        this.content = content
        this.parent = parent
        this.items = []
    }

    addChild(child) {
        this.items.push(child)
    }

}

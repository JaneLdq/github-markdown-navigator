import TreeNode from './tree-node.js'

/**
 * TreeGenerator is a tool class. It is defined to
 * generate the directory structure of the markdown
 * shown on the page.
 */
export default class TreeGenerator {

    /**
     * generate() returns a tree with the structure shown below:
     * - root
     *  - content
     *  - items
     *      -item1
     *          -parent
     *          -content
     *          -items
     *      -item2
     *      -...
     */
    generate() {
        const rootNode = new TreeNode(0, null, null)
        let parent = rootNode
        let cursor = rootNode
        $('.readme .markdown-body :header').each((idx, obj) => {
            let element = $(obj).get(0)
            let tag = element.tagName
            // extract header level
            let level = /H(\d)/i.exec(tag)[1]
            // extract anchor
            let content = {
                href: $($(element).children().get(0)).attr('href'),
                text: element.innerText
            }
            // build tree
            if (level > cursor.level) {
                parent = cursor
            } else if (level < cursor.level) {
                while (level <= parent.level) {
                    parent = parent.parent
                }
            } 
            let node = new TreeNode(level, content, parent)
            parent.addChild(node)
            cursor = node
        })
        return rootNode
    }

}
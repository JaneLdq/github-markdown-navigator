class HeaderNode {
	constructor(level, content, parent) {
		this.level = level;
		this.content = content;
		this.parent = parent;
		this.children = [];
	}

	addChild(child) {
		this.children.push(child);
	}

}

if ($('.readme').length) {
    console.log("[MARKDOWN ROUTER]: START generating directory tree...");

    let tree = generateTree();
    console.log(tree);

    console.log("[MARKDOWN ROUTER]: generating directory tree FINISHED.");
}

function generateTree() {
	let rootNode = parent = cursor = new HeaderNode(0, null, null);
	$('.readme .markdown-body :header').each((idx, obj) => {
		let element = $(obj).get(0);
		let tag = element.tagName;
		// extract header level
		let level = /H(\d)/i.exec(tag)[1];
		// extract anchor
		let content = {
			href: $($(element).children().get(0)).attr('href'),
			text: element.innerText
		};
		// build tree
		if (level > cursor.level) {
			parent = cursor;
		} else if (level < cursor.level) {
			while (level <= parent.level) {
				parent = parent.parent;
			}
		} 
		let node = new HeaderNode(level, content, parent);
		parent.addChild(node);
		cursor = node;
	});
	return rootNode;
}

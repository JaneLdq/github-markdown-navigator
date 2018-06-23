const GH_CONTAINERS = '.container, .container-lg, .container-responsive'
const SPACING = 10
const SIDERBARWIDTH = 260
class TreeNode {

	constructor(level, content, parent) {
		this.level = level
		this.content = content
		this.parent = parent
		this.children = []
	}

	addChild(child) {
		this.children.push(child)
	}

}

class TreeRenderer {

	constructor(tree) {
		this.tree = tree
	}

	render() {
		let nav = '<nav class="md-nav">' + 
			this.renderHeader() +
			this.renderTree(this.tree) + 
			'</nav>'
		$('body').append(nav)
		// $('.js-header-wrapper, #js-flash-container, .application-main, .footer').css({
		// 	position: "relative",
		// 	left: "230px"
		// })
		this.updateLayout(SIDERBARWIDTH)
	}

	updateLayout(sidebarWidth) {
		const $containers = $(GH_CONTAINERS)
		const autoMarginLeft = ($(document).width() - $containers.width()) / 2
		const shouldPushLeft = autoMarginLeft <= sidebarWidth + SPACING

		$('html').css('margin-left', shouldPushLeft ? sidebarWidth : '')
		$containers.css('margin-left', shouldPushLeft ? SPACING : '')
	}

	renderHeader() {
		return '<div class="md-nav-header">' + $('#readme>h3').text().trim() + '</div>'
	}

	renderTree(root) {
		let html = '<ul>'
		if(root.children && root.children.length) {
			root.children.forEach((node) => {
				html += '<li><a href="' + node.content.href + '">' + node.content.text + '</a>'
				if (node.children && node.children.length) {
					html += this.renderTree(node)
				}
				html += '</li>'
			})
		}
		html += '</ul>'
		return html
	}
}

class TreeGenerator {

	generate() {
		let rootNode = new TreeNode(0, null, null)
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

if ($('.readme').length) {
	console.log("[MARKDOWN ROUTER]: START generating directory tree...")

	let tree = new TreeGenerator().generate()
	let renderer = new TreeRenderer(tree)
	renderer.render()

	console.log("[MARKDOWN ROUTER]: generating directory tree FINISHED.")
}
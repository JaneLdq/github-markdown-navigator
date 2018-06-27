const GH_CONTAINERS = '.container, .container-lg, .container-responsive'
const SPACING = 10
const SIDERBARWIDTH = 260
const MIN_SIDEBARWIDTH = 200

class TreeNode {

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

class TreeRenderer {

	constructor() {
		this.generator = new TreeGenerator()
		this.tree = this.generator.generate()
	}

	init() {
		this.render()
		this.listen()
	}

	render() {
		let tmpl = ['<div class="md-nav-wrapper">',
			'<nav class="md-nav">',
			'<div class="md-nav-header"><span>Navigator</span><div class="md-nav-btn" id="js-hide-nav-btn"><i class="fas fa-angle-left"></i></div></div>',
			'<div id="md-nav-tree">',
			'<ul>',
				'{{> list}}',
			'</ul>',
			'</div>',
			'</nav></div>',
			'<div class="md-nav-btn" id="js-show-nav-btn"><i class="fas fa-angle-right"></i></div>'].join('')
		let list = ['{{#each items}}',
			'<li>',
				'<a href="{{content.href}}" class="js-nav-item">{{content.text}}</a>',
				'{{#if items}}',
					'<ul>{{> list}}</ul>',
				'{{/if}}',
			'</li>',
			'{{/each}}'].join('')
		Handlebars.registerPartial("list", list);
		$("body").append(Handlebars.compile(tmpl)({items: this.tree.items}))
		this.resize(SIDERBARWIDTH)
	}

	listen() {
		const $nav = $('.md-nav-wrapper')
		$nav.resizable({ handles: 'e', minWidth: MIN_SIDEBARWIDTH})
		$nav.resize(() => {
			this.resize($nav.outerWidth())
		})
		$('.md-nav ul>li a').click((evt) => {
			$('.js-nav-item').removeClass("item-selected");
			$(evt.target).addClass('item-selected');
		})
		const moveLeft = -$nav.outerWidth()
		$('#js-hide-nav-btn').click((evt) => {
			$nav.css({
				"margin-left": moveLeft
			})
			$('#js-show-nav-btn').css({
				"display":"block"
			})
			this.resize(0)
		})
		$('#js-show-nav-btn').click((evt) => {
			$nav.css({
				"margin-left": 0
			})
			$('#js-show-nav-btn').css({
				"display":"none"
			})
			this.resize($nav.outerWidth())
		})
	}

	refresh() {
		this.tree = this.generator.generate()
		$('.md-nav').remove()
		this.init()
	}

	resize(sidebarWidth) {
		const $containers = $(GH_CONTAINERS)
		const autoMarginLeft = ($(document).width() - $containers.width()) / 2
		const shouldPushLeft = autoMarginLeft <= sidebarWidth + SPACING
		$('html').css('margin-left', shouldPushLeft ? sidebarWidth : '')
	}

	destory() {
		$('.md-nav-wrapper').remove()
		this.resize(0)
	}

}

class TreeGenerator {

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

if ($('.readme').length) {
	console.log("[MARKDOWN ROUTER]: START generating directory tree...")

	let oldUrl = window.location.href
	const renderer = new TreeRenderer()
	renderer.init()

	console.log("[MARKDOWN ROUTER]: generating directory tree FINISHED.")
}
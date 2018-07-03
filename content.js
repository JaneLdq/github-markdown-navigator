const GH_CONTAINERS = '.container, .container-lg, .container-responsive'
const SPACING = 10
const MIN_SIDEBARWIDTH = 160

/**
 * TreeNode is a simple structure. It is defined
 * for generating tree.
 */
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

/**
 * TreeRenderer is defined to render the navigator.
 */
class TreeRenderer {

	/**
	 * Initialize TreeGenerator instance and
	 * add listener for 'pjax:success' event
	 * @constructor
	 */
	constructor() {
		this.generator = new TreeGenerator()
		$(document).on('pjax:success', () => {
  			this.refresh()
		})
	}

	/**
	 * refresh() destroies the old navigator,
	 * and renders a new own according to 
	 * current markdown structure.
	 */
	refresh() {
		this._destory()
		if ($('.readme').length) {
			this.tree = this.generator.generate()
			this._show()
		}
        // TODO: adjust width when window width change
	}

	/**
	 * _destory() remove the navigator and reset layout
	 */
	_destory() {
		this.$nav = null
		$('.md-nav-wrapper').remove()
		$('.md-nav-btn').remove()
		this._resize(0)
	}

	/**
	 * _show() renders and shows the navigator
	 */
	_show() {
		this._render()
		this._listen()
	}

	/**
	 * _render() defines the html template, renders it,
	 * adds it to the page and adjust the layout.
	 * It uses Handlebars.js as template engine.
	 */
	_render() {
		let tmpl = ['<div class="md-nav-wrapper">',
			'<nav class="md-nav">',
			'<div class="md-nav-header">',
				'<span><i class="far fa-laugh-wink"></i></span>',
				'<div class="md-nav-btn" id="js-hide-nav-btn"><i class="fas fa-angle-left"></i></div>',
			'</div>',
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

		this._fit()
	}

	/**
	 * _listen() adds listeners for user actions on navigator
	 */
	_listen() {
		// add listener for resizing
		this.$nav.resizable({ handles: 'e', minWidth: MIN_SIDEBARWIDTH})
		this.$nav.resize(() => {this._fit()})
		$('.md-nav ul>li a').click((evt) => {
			$('.js-nav-item').removeClass("item-selected");
			$(evt.target).addClass('item-selected');
		})

		// add listener for showing and hiding
		$('#js-hide-nav-btn').click(() => {
			this.$nav.css({
				"margin-left": -this.$nav.outerWidth()
			})
			$('#js-show-nav-btn').css({
				"display":"block"
			})
			this._hide()
		})
		$('#js-show-nav-btn').click(() => {
			this.$nav.css({
				"margin-left": 0
			})
			$('#js-show-nav-btn').css({
				"display":"none"
			})
			this._fit()
		})
	}

	/**
	 * _fit() adjusts the width of navigator and github page
	 */
	_fit() {
		if (!this.$nav) {
			this.$nav = $('.md-nav-wrapper')
		}
		if (this.$nav.outerWidth() < MIN_SIDEBARWIDTH) {
			this.$nav.css({width: MIN_SIDEBARWIDTH})
		}
		this._resize(this.$nav.outerWidth())
	}

	/**
	 * _hide() hides the navigator
	 */
	_hide() {
		this._resize(0)
	}

	/**
	 * _resize() resizes the navigator with given width
	 * @param int sidebarWidth
	 */
	_resize(sidebarWidth) {
		const $containers = $(GH_CONTAINERS)
		const autoMarginLeft = ($(document).width() - $containers.width()) / 2
		const shouldPushLeft = autoMarginLeft <= sidebarWidth + SPACING
		$('html').css('margin-left', shouldPushLeft ? sidebarWidth : '')
	}

}

/**
 * TreeGenerator is a tool class. It is defined to
 * generate the directory structure of the markdown
 * shown on the page.
 */
class TreeGenerator {

	/**
	 * generate() returns a tree with the structure shown below:
	 * - root
	 *	- content
	 *	- items
	 *	 	-item1
	 *			-parent
	 *			-content
	 *			-items
	 *		-item2
	 *		-...
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

const renderer = new TreeRenderer()
renderer.refresh()
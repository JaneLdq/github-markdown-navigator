import TreeGenerator from './tree-generator.js'

const GH_CONTAINERS = '.container, .container-lg, .container-responsive'
const SPACING = 10
const MIN_SIDEBARWIDTH = 160

/**
 * TreeRenderer is defined to render the navigator.
 */
export default class TreeRenderer {

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
        let tmpl = `<div class="md-nav-wrapper">
                        <nav class="md-nav">
                            <div class="md-nav-header">
                                <span><i class="far fa-laugh-wink"></i></span>
                                <div class="md-nav-btn" id="js-hide-nav-btn"><i class="fas fa-angle-left"></i></div>
                            </div>
                            <div id="md-nav-tree">${this._listTemplate(this.tree)}</div>
                        </nav></div>
                    <div class="md-nav-btn" id="js-show-nav-btn"><i class="fas fa-angle-right"></i></div>`

        $("body").append(tmpl);

        this._fit()
    }

    _listTemplate(list) {
        if (list && list.items) {
            return `<ul>
                ${list.items.map(item => `<li><a href="${item.content.href}" class="js-nav-item">${item.content.text}</a>
                    ${item.items ? this._listTemplate(item) : ''}</li>`).join('')}
                </ul>`
        }
        return ''
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
'use strict';

const head = document.head || document.getElementsByTagName("head")[0] || document.documentElement;

["libs/jquery.min.js", "libs/jquery-ui.min.js", "src/index.js"].forEach((file) => {
    const script = document.createElement('script')
    script.setAttribute("type", "module")
    script.setAttribute("src", chrome.extension.getURL(file))
    head.insertBefore(script, head.lastChild);
})
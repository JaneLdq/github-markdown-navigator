'use strict';

const body = document.body || document.getElementsByTagName("body")[0] || document.documentElement;

["libs/jquery.min.js", "libs/jquery-ui.min.js", "src/index.js"].forEach((file) => {
    const script = document.createElement('script')
    script.setAttribute("type", "module")
    script.setAttribute("src", chrome.extension.getURL(file))
    body.insertBefore(script, body.lastChild);
})
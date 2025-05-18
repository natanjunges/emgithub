(() => {
    const sourceURL = new URL(document.currentScript.src);
    const params = sourceURL.searchParams;
    const target = new URL(params.get("target"));
    const type = params.get("type") || 'code';
    const style = params.get("style");
    const styleClassName = `hljs-style-${style.replace(/[^a-zA-Z0-9]/g, '-')}`;
    const lightStyles = ['default', 'a11y-light', 'arduino-light', 'ascetic', 'atom-one-light', 'brown-paper', 'color-brewer', 'docco', 'foundation', 'github', 'googlecode', 'gradient-light', 'grayscale', 'idea', 'intellij-light', 'isbl-editor-light', 'kimbie-light', 'lightfair', 'magula', 'mono-blue', 'nnfx-light', 'panda-syntax-light', 'paraiso-light', 'purebasic', 'qtcreator-light', 'routeros', 'school-book', 'stackoverflow-light', 'tokyo-night-light', 'vs', 'xcode', 'base16/atelier-cave-light', 'base16/atelier-dune-light', 'base16/atelier-estuary-light', 'base16/atelier-forest-light', 'base16/atelier-heath-light', 'base16/atelier-lakeside-light', 'base16/atelier-plateau-light', 'base16/atelier-savanna-light', 'base16/atelier-seaside-light', 'base16/atelier-sulphurpool-light', 'base16/brush-trees', 'base16/classic-light', 'base16/cupcake', 'base16/cupertino', 'base16/default-light', 'base16/dirtysea', 'base16/edge-light', 'base16/equilibrium-gray-light', 'base16/equilibrium-light', 'base16/fruit-soda', 'base16/github', 'base16/google-light', 'base16/grayscale-light', 'base16/gruvbox-light-hard', 'base16/gruvbox-light-medium', 'base16/gruvbox-light-soft', 'base16/harmonic16-light', 'base16/heetch-light', 'base16/horizon-light', 'base16/humanoid-light', 'base16/ia-light', 'base16/material-lighter', 'base16/mexico-light', 'base16/one-light', 'base16/papercolor-light', 'base16/ros-pine-dawn', 'base16/sagelight', 'base16/shapeshifter', 'base16/silk-light', 'base16/solar-flare-light', 'base16/solarized-light', 'base16/summerfruit-light', 'base16/synth-midnight-terminal-light', 'base16/tomorrow', 'base16/unikitty-light', 'base16/windows-10-light', 'base16/windows-95-light', 'base16/windows-high-contrast-light', 'base16/windows-nt-light'];
    const isDarkStyle = !lightStyles.includes(style);
    const showBorder = params.get("showBorder") === "on";
    const showLineNumbers = params.get("showLineNumbers") === "on";
    const showFileMeta = params.get("showFileMeta") === "on";
    const showFullPath = params.get("showFullPath") === "on";
    const showCopy = params.get("showCopy") === "on";
    const fetchFromJsDelivr = params.get("fetchFromJsDelivr") === "on";
    const maxHeight = (() => {
        const parsedValue = Number.parseInt(params.get('maxHeight'), 10);
        return Number.isNaN(parsedValue) ? undefined : parsedValue;
    })();
    const lineSplit = target.hash.split("-");
    const startLine = target.hash !== "" && lineSplit[0].replace("#L", "") || -1;
    const endLine = target.hash !== "" && lineSplit.length > 1 && lineSplit[1].replace("L", "") || startLine;
    const tabSize = target.searchParams.get("ts") || 8;
    const pathSplit = target.pathname.split("/");
    const fileURL = target.href;

    if (target.hostname == "github.com") {
        const user = pathSplit[1];
        const repository = pathSplit[2];
        const branch = pathSplit[4];
        const filePath = pathSplit.slice(5, pathSplit.length).join("/");
        const directoryPath = pathSplit.slice(5, pathSplit.length - 1).join("/");
        const rawFileURL = fetchFromJsDelivr
            ? `https://cdn.jsdelivr.net/gh/${user}/${repository}@${branch}/${filePath}`
            : `https://raw.githubusercontent.com/${user}/${repository}/${branch}/${filePath}`;
        const rawDirectoryURL = fetchFromJsDelivr
            ? `https://cdn.jsdelivr.net/gh/${user}/${repository}@${branch}/${directoryPath}/`
            : `https://raw.githubusercontent.com/${user}/${repository}/${branch}/${directoryPath}/`;
    } else {
        const filePath = target.pathname;
        const rawFileURL = target.href.substring(0, target.href.length - target.hash.length);
        const rawDirectoryURL = rawFileURL.substring(0, rawFileURL.lastIndexOf("/"));
    }

    const fileExtension = filePath.split('.').length > 1 ? filePath.split('.').pop() : 'txt';
    const containerId = `id-${Math.random().toString(36).substring(2)}`;
    loadLink('https://cdn.jsdelivr.net/gh/natanjunges/source-embed@main/embed-v3.css');
    document.currentScript.insertAdjacentHTML(
        'afterend',
        `

<style>
    /* use where() for backward compatibility */
    :where(#${containerId} .source-embed-file .code-area pre) {
        tab-size: ${tabSize};
    }

    /* use where() for backward compatibility */
    :where(#${containerId} .source-embed-file .code-area pre code.hljs) {
        max-height: ${maxHeight ? maxHeight + 'px' : 'none'};
        overflow-y: ${maxHeight ? 'auto' : 'visible'};
    }

    /* use where() for backward compatibility */
    :where(#${containerId} .source-embed-file .html-area.markdown-body) {
        max-height: ${maxHeight ? maxHeight + 'px' : 'none'};
        overflow-y: ${maxHeight ? 'auto' : 'visible'};
    }
</style>

<div id="${containerId}" class="source-embed-container">
    <div class="lds-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    <div class="source-embed-file source-embed-file-${isDarkStyle ? 'dark' : 'light'}" style="display:none;${showBorder ? '' : 'border:0'}">
        <div class="file-data ${styleClassName}">
            ${type === 'code' ? `<div class="code-area">
                ${showCopy ? `<a class="copy-btn copy-btn-${isDarkStyle ? 'dark' : 'light'}" href="javascript:void(0)">Copy</a>` : ''}
                <pre><code class="${fileExtension} ${showLineNumbers ? '' : 'hide-line-numbers'}"></code></pre>
            </div>`: ''}
            ${type === 'markdown' || type === 'ipynb' ? `<div class="html-area markdown-body"></div>` : ''}
        </div>
        ${showFileMeta ? `<div class="file-meta file-meta-${isDarkStyle ? 'dark' : 'light'}" style="${showBorder ? '' : 'border:0'}">
            <a target="_blank" href="${rawFileURL}" style="float:right">view raw</a>
            <a target="_blank" href="${fileURL}">${decodeURIComponent(showFullPath ? filePath : pathSplit[pathSplit.length - 1])}</a>
            delivered <span class="hide-in-phone">with ❤ </span>by <a target="_blank" href="https://github.com/natanjunges/source-embed">source-embed</a>
        </div>`: ''}
    </div>
</div>

        `
    );
    const promises = [];
    const fetchFile = fetch(rawFileURL).then((response) => {
        if (response.ok) {
            return response.text();
        }

        return Promise.reject(`${response.status}\nFailed to download ${rawFileURL}`);
    });
    promises.push(fetchFile);
    // Loading the external libraries
    const HLJSURL = "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.6.0/build/highlight.min.js";
    const HLJSNumURL = "https://cdn.jsdelivr.net/npm/highlightjs-line-numbers.js@2.8.0/dist/highlightjs-line-numbers.min.js";
    const loadHLJS = typeof hljs != "undefined" && typeof hljs.highlightElement != "undefined" ? Promise.resolve() : loadScript(HLJSURL);
    // Always use hljs-num even if showLineNumbers is false for a consistent display
    // hljs-num should be loaded only after hljs is loaded
    const loadHLJSNum = loadHLJS.then(() => (typeof hljs.lineNumbersBlock != "undefined" ? Promise.resolve() : loadScript(HLJSNumURL)));
    //https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.6.0/build/styles/${style}.min.css
    loadLink(`https://cdn.jsdelivr.net/gh/natanjunges/source-embed@main/styles/${style}.min.css`);
    promises.push(loadHLJSNum);

    if (type === 'markdown' || type === 'ipynb') {
        const loadMarked = typeof marked != "undefined" ? Promise.resolve() : loadScript('https://cdn.jsdelivr.net/npm/marked@4.0.18/marked.min.js');
        loadLink(`https://cdn.jsdelivr.net/gh/sindresorhus/github-markdown-css@5.1.0/github-markdown-${isDarkStyle ? 'dark' : 'light'}.min.css`);
        //https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.css
        loadLink('https://cdn.jsdelivr.net/gh/natanjunges/source-embed@main/katex.min.css');
        promises.push(loadMarked);

        if (type === 'ipynb') {
            const loadAnsiUp = typeof AnsiUp != "undefined" ? Promise.resolve() : loadScript('https://cdn.jsdelivr.net/gh/drudru/ansi_up@4.0.4/ansi_up.min.js');
            const loadDOMPurify = typeof DOMPurify != "undefined" ? Promise.resolve() : loadScript('https://cdn.jsdelivr.net/npm/dompurify@2.3.10/dist/purify.min.js');
            const loadNotebookjs = Promise.all([loadMarked, loadAnsiUp, loadDOMPurify])
                .then(() => (typeof nb != "undefined" ? Promise.resolve() : loadScript('https://cdn.jsdelivr.net/gh/jsvine/notebookjs@0.6.7/notebook.min.js')))
                .then(() => {
                    nb.markdown = (text) => marked.parse(text, { baseUrl: rawDirectoryURL });
                    const ansi_up = new AnsiUp();
                    ansi_up.escape_for_html = false; // https://github.com/drudru/ansi_up/issues/66
                    // bind 'this' to fix 'TypeError: this.append_buffer is not a function'
                    nb.ansi = ansi_up.ansi_to_html.bind(ansi_up);
                    // or: nb.ansi = (text) => ansi_up.ansi_to_html(text);
                });
            promises.push(loadNotebookjs);
        }
    }

    // Do the happy embedding
    Promise.allSettled(promises).then((result) => {
        const targetDiv = document.getElementById(containerId);
        const fetchSuccess = result[0].status === "fulfilled";

        if (type === 'code') {
            let codeText;

            if (fetchSuccess) {
                codeText = result[0].value;

                if (codeText[codeText.length - 1] === "\n") {
                    // First remove the ending newline
                    codeText = codeText.slice(0, -1);
                }

                let codeTextSplit = codeText.split("\n");

                if (startLine > 0) {
                    codeTextSplit = codeTextSplit.slice(startLine - 1, endLine);
                }

                // Strip leading whitespace as otherwise we get pointless whitespace/indentation
                // for code snippets from the middle of functions (#22)
                while (true) {
                    const firstChars = codeTextSplit.filter(s => s.length > 0).map(s => s[0]);

                    if (new Set(firstChars).size == 1 && [' ', '\t'].includes(firstChars[0])) {
                        // If all the lines begin with ' ' or '\t', strip the first char
                        codeTextSplit = codeTextSplit.map(s => s.slice(1));
                    } else {
                        break;
                    }
                }

                codeText = codeTextSplit.join("\n");
                // Then add the newline back
                codeText = codeText + "\n";
            } else {
                codeText = result[0].reason;
            }

            const codeTag = targetDiv.querySelector("code");
            codeTag.textContent = codeText;

            if (showCopy) {
                targetDiv.querySelector(".copy-btn").addEventListener('click', function (e) {
                    e.preventDefault();
                    e.cancelBubble = true;
                    copyTextToClipboard(codeText);
                });
            }

            hljs.highlightElement(codeTag);
            hljs.lineNumbersBlock(codeTag, {
                singleLine: true,
                startFrom: (startLine > 0 && fetchSuccess) ? Number.parseInt(startLine) : 1
            });
        } else if (type === 'markdown') {
            targetDiv.querySelector(".html-area").innerHTML = fetchSuccess ? marked.parse(result[0].value, { baseUrl: rawDirectoryURL }) : result[0].reason;
        } else if (type === 'ipynb') {
            try {
                if (fetchSuccess) {
                    const notebook = nb.parse(JSON.parse(result[0].value));
                    const rendered = notebook.render();
                    targetDiv.querySelector(".html-area").appendChild(rendered);
                } else {
                    throw result[0].reason;
                }
            } catch (error) {
                // catch either the file downloading error or notebook parsing error
                targetDiv.querySelector(".html-area").innerText = error.toString();
            }
        }

        if (type === 'markdown' || type === 'ipynb') {
            targetDiv.querySelectorAll("pre code").forEach(codeTag => {
                if (type === 'ipynb' && codeTag.classList.contains("lang-undefined")) {
                    codeTag.classList.remove("lang-undefined");
                    codeTag.classList.add("lang-python");
                }

                hljs.highlightElement(codeTag);
            });
            // Load Katex and KatexAutoRender after Notebookjs, to avoid the logic bug in https://github.com/jsvine/notebookjs/blob/02f0b451a0095f839c28b267c568f40694ad9362/notebook.js#L265-L273
            // Specifically, in that code snippet, if `el.innerHTML` is assigned with something like `include <stdio.h>`,
            // then the value read from `el.innerHTML` will be `include <stdio.h></stdio.h>`,
            // So if `#include <stdio.h>` is in a Markdown code block, wrong results will be rendered
            const loadKatex = typeof katex != "undefined" ? Promise.resolve() : loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/katex.min.js');
            const loadKatexAutoRender = loadKatex.then(() => typeof renderMathInElement != "undefined" ? Promise.resolve() : loadScript('https://cdn.jsdelivr.net/npm/katex@0.16.0/dist/contrib/auto-render.min.js'));
            loadKatexAutoRender.then(() => {
                renderMathInElement(targetDiv, {
                    delimiters: [
                        { left: '$$', right: '$$', display: true },
                        { left: '$', right: '$', display: false },
                        { left: '\\(', right: '\\)', display: false },
                        { left: '\\[', right: '\\]', display: true },
                    ],
                    throwOnError: false
                });
            });
        }

        targetDiv.querySelector(".lds-ring").style.display = "none";
        targetDiv.querySelector(".source-embed-file").style.display = "block";
    });
})();

function loadScript(src) {
    return new Promise((resolve, reject) => {
        let script = document.querySelector(`head > script[src="${src}"]`)

        if (!script) {
            script = document.createElement('script');
            script.src = src;
            document.head.appendChild(script);
        }

        script.addEventListener("load", resolve);
        script.addEventListener("error", reject);
    });
}

function loadLink(href) {
    let link = document.querySelector(`head > link[href="${href}"]`)

    if (!link) {
        link = document.createElement('link');
        link.rel = "stylesheet";
        link.href = href
        document.head.appendChild(link);
    }
}

// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
function copyTextToClipboard(text) {
    if (!navigator.clipboard) {
        fallbackCopyTextToClipboard(text);
        return;
    }

    navigator.clipboard.writeText(text);
}

function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed"; //avoid scrolling to bottom
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
    } catch (err) {
        console.error('fallbackCopyTextToClipboard: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
}

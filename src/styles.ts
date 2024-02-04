import type { elements } from './index';

const css = `
    :root {
        --base: #fff;
        --border: #c8c8c8;
        --border-hover: #91a8c1;
        --text: #000;
        --selected-gradient: linear-gradient(0deg,#d6fcff,#fff 90%);
    }

    .search-bar-container {
        display: flex;
        position: sticky;
        top: 0px;
        background: var(--base);
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
        padding: 9px;
    }

    .search-bar {
        margin: 4px;
        padding: 8px 8px 7px;
        border-radius: 5px;
        display: inline-block;
        border: 1px solid var(--border);
        width: 100%;
        font-family: Roboto, sans-serif;
        font-size: 15.4px;
        background-color: var(--base);
        color: var(--text);
    }

    .settings-details {
        margin: 4px;
        height: 40px;
    }

    .settings-summary {
        list-style: none;
    }

    .settings-button {
        height: 40px;
        padding: 8px 8px 7px;
        border: 1px solid var(--border);
        border-radius: 5px;
        cursor: pointer;
        opacity: .8;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }
    .settings-button:hover {
        transform: scale(1.05)
    }

    .settings-content {
        display: flex;
        flex-direction: column;
        gap: 5px;
        position: absolute;
        right: 13px;
        padding: 8px 8px 7px;
        border: 1px solid var(--border);
        border-radius: 5px;
        background-color: var(--base);
    }

    .setting {
        display: flex;
        gap: 5px;
        justify-content: flex-end;
        cursor: pointer;
        padding: 8px 8px 7px;
        border: 1px solid var(--border);
        border-radius: 5px;
        user-select: none;
        line-height: 1em;
        font-family: Roboto, sans-serif;
        font-size: 15.4px;
        color: var(--text);
    }
    .setting:hover {
        background: var(--selected-gradient);
        border: 1px solid var(--border-hover);
    }

    .setting > img {
        height: 1em;
        opacity: .8;
    }

    #import-save {
        display: none;
    }

    .search-hidden {
        height: 0px !important;
        border: 0px !important;
        font-size: 0px !important;
        margin: 0px !important;
        visibility: hidden;
    }

    .search-hidden .item-emoji {
        font-size: 0px;
    }

    .sidebar-controls {
        background-color: var(--base);
    }

    .instruction {
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: auto !important;
    }

    .logo {
        position: fixed;
        top: 10px;
        right: 320px;
        width: 80px;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        pointer-events: none;
    }

    .site-title {
        z-index: 1;
    }

    .side-controls {
        z-index: 1;
    }
`;

export function init(elements: elements) {
	elements.styles.appendChild(document.createTextNode(css.trim()));
	document.getElementsByTagName('head')[0].appendChild(elements.styles);
}

import type { elements } from './index';

const css = `
    :root {
        --base: #fff;
        --border: #c8c8c8;
        --border-hover: #91a8c1;
        --text: #000;
        --selected-gradient: linear-gradient(0deg,#d6fcff,#fff 90%);
    }

    .item {
        margin: 4px;
        cursor: pointer;
        padding: 8px 8px 7px;
        border-radius: 5px;
        display: inline-block;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        border: 1px solid var(--border);
        transition: background .15s linear;
        background: var(--base);
        line-height: 1em;
        white-space: nowrap;
    }

    .item:hover {
        background: var(--selected-gradient);
        border: 1px solid var(--border-hover);
    }

    @media screen and (min-width: 1150px) {
        .item {
            font-size: 16.4px;
            padding: 9px 10px 8px;
        }
    }

    .pinned {
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
        padding: 9px;
        border: 0px;
        border-bottom: 1px;
        border-style: solid;
        border-color: var(--border);
    }

    .pinned-title {
        margin: 4px;
        font-size: 15px;
        font-family: Roboto, sans-serif;
        color: var(--text);
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        pointer-events: none;
    }

    .sidebar {
        width: var(--sidebar) !important;
    }

    .resize-bar {
        position: absolute;
        height: 100%;
        width: 5px;
        right: calc(var(--sidebar) - 3px);
        z-index: 10;
        cursor: ew-resize;
    }

    .sidebar-header {
        display: flex;
        position: sticky;
        height: auto !important;
        top: 0px;
        background-color: var(--base) !important;
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
        padding: 9px;
        border: 0px;
        border-bottom: 1px;
        border-style: solid;
        border-color: var(--border);
    }

    .sidebar-search {
        width: 100%;
    }

    .sidebar-input {
        height: 40px !important;
        margin: 4px;
        border-radius: 5px;
        border: 1px solid var(--border) !important;
        font-family: Roboto, sans-serif;
        background-size: 21px 21px !important;
        background-position: 10px 10px !important;
        background-color: var(--base) !important;
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
        -webkit-user-select: none;
        -moz-user-select: none;
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
        aspect-ratio: 1 / 1;
    }

    #import-save {
        display: none;
    }

    .site-title {
        z-index: 1;
    }

    .logo {
        width: 85px !important;
        right: calc(var(--sidebar) + 15px) !important;
    }

    .version {
        position: fixed;
        top: 85px;
        right: calc(var(--sidebar) + 15px);
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        pointer-events: none;
        color: var(--text);
        font-family: Roboto, sans-serif;
        font-size: 11px;
    }

    .side-controls {
        right: calc(var(--sidebar) + 9px) !important;
        z-index: 1;
    }

    .random, .discoveries-icon {
        width: 21px;
        cursor: pointer;
        opacity: .8;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }

    .random:hover, .discoveries-icon:hover {
        transform: scale(1.05);
    }

    .modal {
        max-width: 75%;
        max-height: 75%;
        margin: auto;
        padding-top: 0px;
        border: 1px solid var(--border);
        border-radius: 5px;
        background-color: var(--base);
    }

    .modal::backdrop {
        background-color: rgb(0 0 0 / .5);
    }

    .modal-header {
        position: sticky;
        top: 0;
        display: flex;
        gap: 1rem;
        padding-top: 16px;
        padding-bottom: 16px;
        justify-content: space-between;
        background-color: var(--base);
    }

    .modal-title {
        font-size: 20px;
        font-family: Roboto, sans-serif;
        line-height: 35px;
        color: var(--text);
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }

    .modal-text {
        font-size: 15px;
        font-family: Roboto, sans-serif;
        color: var(--text);
        text-align: center;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        pointer-events: none;
    }

    .display-item {
        margin: 4px;
        padding: 8px 8px 7px;
        border-radius: 5px;
        display: inline-block;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        border: 1px solid var(--border);
        background: var(--base);
        line-height: 1em;
        white-space: nowrap;
        color: var(--text);
    }

    @media screen and (min-width: 1150px) {
        .display-item {
            font-size: 16.4px;
            padding: 9px 10px 8px;
        }
    }

    .recipe {
        display: flex;
        align-items: center;
        color: var(--text);
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }

    .modal-button-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 16px;
        color: var(--text);
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }

    .modal-button-container > .item {
        font-family: Roboto, sans-serif;
        font-size: 15.4px;
        text-decoration: auto;
    }

    .close-button {
        height: 35px;
        padding: 8px 8px 7px;
        border: 1px solid var(--border);
        border-radius: 5px;
        cursor: pointer;
        opacity: .8;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }
    .close-button:hover {
        transform: scale(1.05)
    }

    .instance-emoji {
        pointer-events: none;
    }
`;

export function init(elements: elements) {
	elements.styles.appendChild(document.createTextNode(css.trim()));
	document.getElementsByTagName('head')[0].appendChild(elements.styles);
}

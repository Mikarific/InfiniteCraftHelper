import type { elements } from './index';

const css = `
    .dark-mode .site-title, .dark-mode .instruction-icon, .dark-mode .settings-button, .dark-mode .setting > img, .dark-mode .close-button {
        filter: invert(1);
    }

    .dark-mode {
        scrollbar-color: var(--border-color) #262626;
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
        border: 1px solid var(--border-color);
        transition: background .15s linear;
        background: var(--item-bg);
        line-height: 1em;
        color: var(--text-color);
        white-space: nowrap;
    }

    .item:hover {
        background: var(--instance-bg-hover);
        border: 1px solid var(--instance-border-hover);
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
        border-color: var(--border-color);
    }

    .pinned-title {
        margin: 4px;
        font-size: 15px;
        font-family: Roboto, sans-serif;
        color: var(--text-color);
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        pointer-events: none;
    }

    .sidebar {
        width: var(--sidebar-size) !important;
    }

    .resize-bar {
        position: absolute;
        height: 100%;
        width: 5px;
        right: calc(var(--sidebar-size) - 3px);
        z-index: 10;
        cursor: ew-resize;
    }

    .sidebar-header {
        display: flex;
        position: sticky;
        height: auto !important;
        top: 0px;
        background-color: var(--background-color) !important;
        max-width: 900px;
        margin-left: auto;
        margin-right: auto;
        padding: 9px;
        border: 0px;
        border-bottom: 1px;
        border-style: solid;
        border-color: var(--border-color);
    }

    .sidebar-search {
        width: 100%;
    }

    .sidebar-input {
        height: 40px !important;
        margin: 4px;
        border-radius: 5px;
        border: 1px solid var(--border-color) !important;
        font-family: Roboto, sans-serif;
        background-size: 21px 21px !important;
        background-position: 10px 10px !important;
        color: var(--text-color);
    }

    .settings-details {
        display: flex;
        margin: 4px;
        height: 40px;
        border: 1px solid var(--border-color);
        border-radius: 5px;
    }

    .settings-summary {
        display: flex;
        list-style: none;
    }

    .settings-button {
        height: 40px;
        padding: 8px 8px 7px;
        cursor: pointer;
        opacity: .8;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        aspect-ratio: 1/1;
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
        border: 1px solid var(--border-color);
        border-radius: 5px;
        background-color: var(--background-color);
    }

    .setting {
        display: flex;
        gap: 5px;
        justify-content: flex-end;
        cursor: pointer;
        padding: 8px 8px 7px;
        border: 1px solid var(--border-color);
        border-radius: 5px;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        line-height: 1em;
        font-family: Roboto, sans-serif;
        font-size: 15.4px;
        color: var(--text-color);
    }

    .setting:hover {
        background: var(--instance-bg-hover);
        border: 1px solid var(--instance-border-hover);
    }

    .setting > img {
        height: 1em;
        opacity: .8;
        aspect-ratio: 1 / 1;
    }

    #import-save {
        display: none;
    }

    .logo {
        width: 85px !important;
        right: calc(var(--sidebar-size) + 15px) !important;
    }

    .version {
        position: fixed;
        top: 85px;
        right: calc(var(--sidebar-size) + 15px);
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        pointer-events: none;
        color: var(--text-color);
        font-family: Roboto, sans-serif;
        font-size: 11px;
    }

    .side-controls {
        right: calc(var(--sidebar-size) + 9px) !important;
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
        border: 1px solid var(--border-color);
        border-radius: 5px;
        background-color: var(--background-color);
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
        background-color: var(--background-color);
    }

    .modal-title {
        font-size: 20px;
        font-family: Roboto, sans-serif;
        line-height: 35px;
        color: var(--text-color);
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }

    .modal-text {
        font-size: 15px;
        font-family: Roboto, sans-serif;
        color: var(--text-color);
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
        border: 1px solid var(--border-color);
        background: var(--item-bg);
        line-height: 1em;
        white-space: nowrap;
        color: var(--text-color);
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
        color: var(--text-color);
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }

    .modal-button-container {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-top: 16px;
        color: var(--text-color);
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }

    .modal-button-container > .item {
        font-family: Roboto, sans-serif;
        font-size: 15.4px;
        text-decoration: auto;
    }

    .close-button-container {
        display: flex;
        border: 1px solid var(--border-color);
        border-radius: 5px;
    }

    .close-button {
        height: 35px;
        padding: 8px 8px 7px;
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

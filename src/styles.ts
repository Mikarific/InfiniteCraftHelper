const css = `
    .search-bar-container {
        display: flex;
        position: sticky;
        top: 0px;
        background: #fff;
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
        border: 1px solid #c8c8c8;
        width: 100%;
        font-family: Roboto, sans-serif;
        font-size: 15.4px;
    }

    .instruction {
        display: flex;
        flex-direction: column;
        align-items: center;
        pointer-events: auto !important;
    }

    .import-state {
        margin: 12px;
        cursor: pointer;
        padding: 8px 8px 7px;
        border-radius: 5px;
        display: inline-block;
        user-select: none;
        border: 1px solid #c8c8c8;
        background: #fff;
        line-height: 1em;
        font-family: Roboto, sans-serif;
        font-size: 15.4px;
        width: max-content;
    }

    .import-state:hover {
        background:linear-gradient(0deg,#d6fcff,#fff 90%);
        border: 1px solid #91a8c1
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

    .helper-controls {
        position: fixed;
        left: 7px;
        bottom: 7px;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
        display: flex;
        grid-gap: 19px;
    }

    .download-icon {
        width: 21px;
        cursor: pointer;
        opacity: .8;
        -webkit-user-select: none;
        -moz-user-select: none;
        user-select: none;
    }
    .download-icon:hover {
        transform: scale(1.05)
    }
`;

export function init() {
	const style = document.createElement('style');
	style.appendChild(document.createTextNode(css.trim()));
	document.getElementsByTagName('head')[0].appendChild(style);
}

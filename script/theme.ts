import type { elements } from './index';

import { darkmode, lightmode } from './lib/assets';

let theme = 'light';

const darkCSS = `
	:root {
		--base: #18181b !important;
        --border: #525252 !important;
        --border-hover: #91a8c1 !important;
        --text: #fff !important;
		--selected-gradient: linear-gradient(0deg,#3b0764,#18181b 90%) !important;
	}

	* {
		scrollbar-color: #525252 #262626;
	}

	.settings-button, .setting > img, .site-title, .logo, .coffee-link, .clear, .sound, .random, .discoveries-icon, .close-button, .sort-img, .particles {
        filter: invert(1) !important;
    }

	.reset, .sort {
		color: var(--text) !important;
	}

	.particles {
		background-color: #e7e7e4 !important;
	}

	.sidebar, .items, .item, .mobile-sound {
		background-color: var(--base) !important;
	}

	.item, .mobile-sound {
		border-color: var(--border) !important;
	}

	.item, .instruction {
		color: var(--text) !important;
		
	}
	.item:hover {
        background: var(--selected-gradient) !important;
        border: 1px solid var(--border-hover) !important;
    }

	.instance {
		background: linear-gradient(0deg, #170326, #18181b 70%) !important;
	}
`;
const darkStyles = document.createElement('style');
darkStyles.appendChild(document.createTextNode(darkCSS.trim()));

export function init(elements: elements) {
	theme = localStorage.getItem('theme') === 'light' ? 'light' : 'dark';
	if (localStorage.getItem('theme') === null) {
		localStorage.setItem('theme', theme);
	}

	const themeContainer = document.createElement('div');
	themeContainer.classList.add('setting');

	const themeText = document.createTextNode('Toggle Theme');
	themeContainer.appendChild(themeText);

	const themeImage = document.createElement('img');
	if (theme === 'light') {
		themeImage.src = lightmode.trim();
	} else {
		themeImage.src = darkmode.trim();
		document.getElementsByTagName('head')[0].appendChild(darkStyles);
	}
	themeContainer.appendChild(themeImage);

	elements.settingsContent.appendChild(themeContainer);
	themeContainer.addEventListener('click', (e) => {
		if (theme === 'dark') {
			theme = 'light';
			themeImage.src = lightmode.trim();
			darkStyles.remove();
		} else {
			theme = 'dark';
			themeImage.src = darkmode.trim();
			document.getElementsByTagName('head')[0].appendChild(darkStyles);
		}
		localStorage.setItem('theme', theme);
	});
}

import type { elements } from './index';

import { logo } from './lib/assets';

export function init(elements: elements) {
	elements.logo.src = logo.trim();

	const versionNumber = document.createElement('p');
	versionNumber.appendChild(document.createTextNode(`v${GM.info.script.version}`));
	versionNumber.classList.add('version');
	elements.logo.after(versionNumber);
}

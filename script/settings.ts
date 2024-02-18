import type { elements } from './index';

import { contributeIcon, dontContributeIcon, settingsIcon } from './lib/assets';

export let contributeToDatabase = false;

export function init(elements: elements) {
	const settingsDetails = document.createElement('details');
	settingsDetails.classList.add('settings-details');
	elements.sidebarHeader.appendChild(settingsDetails);

	const settingsSummary = document.createElement('summary');
	settingsSummary.classList.add('settings-summary');
	settingsDetails.appendChild(settingsSummary);

	const settingsButton = document.createElement('img');
	settingsButton.src = settingsIcon.trim();
	settingsButton.classList.add('settings-button');
	settingsSummary.appendChild(settingsButton);

	settingsDetails.appendChild(elements.settingsContent);

	document.addEventListener('click', function (e) {
		const target = (e as MouseEvent).target as Node | null;
		if (!settingsDetails.contains(target)) {
			settingsDetails.removeAttribute('open');
		}
	});

	contributeToDatabase = localStorage.getItem('contributeToDatabase') === 'false' ? false : true;

	const contributeContainer = document.createElement('div');
	contributeContainer.classList.add('setting');

	const contributeText = document.createTextNode('Share Crafts?');
	contributeContainer.appendChild(contributeText);

	const contributeImage = document.createElement('img');
	if (!contributeToDatabase) {
		contributeImage.src = dontContributeIcon.trim();
	} else {
		contributeImage.src = contributeIcon.trim();
	}
	contributeContainer.appendChild(contributeImage);
	elements.settingsContent.appendChild(contributeContainer);

	contributeContainer.addEventListener('click', (e) => {
		if (!contributeToDatabase) {
			contributeToDatabase = true;
			contributeImage.src = contributeIcon.trim();
			localStorage.setItem('contributeToDatabase', 'true');
		} else {
			contributeToDatabase = false;
			contributeImage.src = dontContributeIcon.trim();
			localStorage.setItem('contributeToDatabase', 'false');
		}
	});
}

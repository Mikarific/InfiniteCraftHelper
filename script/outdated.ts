import type { elements } from './index';

import { closeIcon } from './lib/assets';

function semverCompare(current: string, latest: string) {
	if (current.startsWith(latest + '-')) return -1;
	if (latest.startsWith(current + '-')) return 1;
	return current.localeCompare(latest, undefined, { numeric: true, sensitivity: 'case', caseFirst: 'upper' }) === -1;
}

export function init(elements: elements) {
	GM.xmlHttpRequest({
		method: 'GET',
		url: `https://github.com/Mikarific/InfiniteCraftHelper/raw/main/gorilla.json`,
		onload: (response) => {
			if (response.status === 200) {
				const responseJSON = JSON.parse(response.responseText);
				if (semverCompare(GM.info.script.version, responseJSON.version)) {
					const outdatedModal = document.createElement('dialog');
					outdatedModal.classList.add('modal');
					elements.container.appendChild(outdatedModal);

					const outdatedHeader = document.createElement('div');
					outdatedHeader.classList.add('modal-header');

					const outdatedTitle = document.createElement('h1');
					outdatedTitle.classList.add('modal-title');
					outdatedTitle.appendChild(document.createTextNode('Infinite Craft Helper is out of date!'));
					outdatedHeader.appendChild(outdatedTitle);

					const closeButtonContainer = document.createElement('div');
					closeButtonContainer.classList.add('close-button-container');

					const closeButton = document.createElement('img');
					closeButton.src = closeIcon.trim();
					closeButton.classList.add('close-button');
					closeButtonContainer.appendChild(closeButton);

					outdatedHeader.appendChild(closeButtonContainer);

					outdatedModal.appendChild(outdatedHeader);

					const versionText = document.createElement('div');
					versionText.classList.add('modal-text');
					versionText.appendChild(
						document.createTextNode(
							`You are on v${GM.info.script.version}! The latest verion is v${responseJSON.version}!`,
						),
					);
					outdatedModal.appendChild(versionText);

					const buttonContainer = document.createElement('div');
					buttonContainer.classList.add('modal-button-container');

					const updateButton = document.createElement('a');
					updateButton.classList.add('item');
					updateButton.href = responseJSON.downloadURL;
					updateButton.appendChild(document.createTextNode('Update'));
					buttonContainer.appendChild(updateButton);

					const continueButton = document.createElement('button');
					continueButton.classList.add('item');
					continueButton.appendChild(document.createTextNode('Continue Anyways'));
					buttonContainer.appendChild(continueButton);

					outdatedModal.appendChild(buttonContainer);

					outdatedModal.showModal();

					closeButton.addEventListener('click', (e) => {
						outdatedModal.close();
					});

					continueButton.addEventListener('click', (e) => {
						outdatedModal.close();
					});
				}
			}
		},
	});
}

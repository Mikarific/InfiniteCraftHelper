import { openCraftsForElement, recipes } from './crafts';
import type { elements } from './index';

import { closeIcon, discoveriesIcon } from './lib/assets';

declare const unsafeWindow: any;
declare const cloneInto: any;

const discoveriesModal = document.createElement('dialog');
const discoveriesHeader = document.createElement('div');
const discoveriesEmpty = document.createElement('div');

export function init(elements: elements) {
	const discoveriesImage = document.createElement('img');
	discoveriesImage.src = discoveriesIcon.trim();
	discoveriesImage.classList.add('discoveries-icon');
	elements.sideControls.appendChild(discoveriesImage);

	discoveriesModal.classList.add('modal');
	elements.container.appendChild(discoveriesModal);

	discoveriesHeader.classList.add('modal-header');

	const discoveriesTitle = document.createElement('h1');
	discoveriesTitle.classList.add('modal-title');
	discoveriesTitle.appendChild(document.createTextNode('Your First Discoveries'));
	discoveriesHeader.appendChild(discoveriesTitle);

	const closeButtonContainer = document.createElement('div');
	closeButtonContainer.classList.add('close-button-container');

	const closeButton = document.createElement('img');
	closeButton.src = closeIcon.trim();
	closeButton.classList.add('close-button');
	closeButtonContainer.appendChild(closeButton);

	discoveriesHeader.appendChild(closeButtonContainer);

	discoveriesModal.appendChild(discoveriesHeader);

	discoveriesEmpty.classList.add('modal-text');
	discoveriesEmpty.appendChild(document.createTextNode("You don't have any first discoveries!"));
	discoveriesModal.appendChild(discoveriesEmpty);

	const discoveredElements = cloneInto(
		unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements,
		unsafeWindow,
	).filter((el: { text: string; emoji?: string; discovered: boolean }) => el.discovered === true);

	for (const discoveredElement of discoveredElements) {
		addElementToDiscoveries(discoveredElement);
	}

	discoveriesImage.addEventListener('click', (e) => {
		discoveriesModal.showModal();
	});

	closeButton.addEventListener('click', (e) => {
		discoveriesModal.close();
	});
}

export function addElementToDiscoveries(element: { text: string; emoji?: string; discovered: boolean }) {
	const recipeKeys = Object.keys(recipes);

	const elementDiv = document.createElement('div');
	recipeKeys.includes(element.text) ? elementDiv.classList.add('item') : elementDiv.classList.add('display-item');

	const elementEmoji = document.createElement('span');
	recipeKeys.includes(element.text)
		? elementEmoji.classList.add('item-emoji')
		: elementEmoji.classList.add('display-item-emoji');
	elementEmoji.appendChild(document.createTextNode(element.emoji ?? '⬜'));
	elementDiv.appendChild(elementEmoji);

	elementDiv.appendChild(document.createTextNode(` ${element.text} `));

	if (recipeKeys.includes(element.text)) {
		elementDiv.addEventListener('click', () => {
			openCraftsForElement(element);
		});
	}

	discoveriesModal.appendChild(elementDiv);
	discoveriesEmpty.style.display = 'none';
}

export function resetDiscoveries() {
	discoveriesModal.innerHTML = '';
	discoveriesModal.appendChild(discoveriesHeader);
	discoveriesModal.appendChild(discoveriesEmpty);
	discoveriesEmpty.style.display = '';
}

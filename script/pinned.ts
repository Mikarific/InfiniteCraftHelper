import type { elements } from './index';

declare const GM: any;
declare const unsafeWindow: any;

export const pinnedContainer = document.createElement('div');
export const pinnedTitle = document.createElement('div');

export let pinnedElements: { text: string; emoji?: string; discovered: boolean }[] = [];

export async function init(elements: elements) {
	pinnedContainer.classList.add('pinned');

	pinnedTitle.classList.add('pinned-title');
	pinnedTitle.appendChild(document.createTextNode('Pinned Elements'));
	pinnedContainer.appendChild(pinnedTitle);

	pinnedElements = JSON.parse(((await GM.getValue('pinned')) as string) ?? '[]');
	if (pinnedElements.length === 0) pinnedContainer.style.display = 'none';
	for (const pinnedElement of pinnedElements) {
		const elementDiv = document.createElement('div');
		elementDiv.classList.add('item');

		const elementEmoji = document.createElement('span');
		elementEmoji.classList.add('item-emoji');
		elementEmoji.appendChild(document.createTextNode(pinnedElement.emoji ?? '⬜'));
		elementDiv.appendChild(elementEmoji);

		elementDiv.appendChild(document.createTextNode(` ${pinnedElement.text} `));

		elementDiv.addEventListener('mousedown', (e) => {
			unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].selectElement(e, pinnedElement);
		});

		pinnedContainer.appendChild(elementDiv);
	}

	elements.items.before(pinnedContainer);
}

export async function pinElement(element: { text: string; emoji?: string; discovered: boolean }) {
	if (pinnedElements.find((el) => el.text === element.text) === undefined) {
		unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].playInstanceSound();
		const elementDiv = document.createElement('div');
		elementDiv.classList.add('item');
		const elementEmoji = document.createElement('span');
		elementEmoji.classList.add('item-emoji');
		elementEmoji.appendChild(document.createTextNode(element.emoji ?? '⬜'));
		elementDiv.appendChild(elementEmoji);
		elementDiv.appendChild(document.createTextNode(` ${element.text} `));
		elementDiv.addEventListener('mousedown', (e) => {
			unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].selectElement(e, element);
		});
		pinnedContainer.appendChild(elementDiv);
		if (pinnedElements.length === 0) pinnedContainer.style.display = '';
		pinnedElements.push(element);
		await GM.setValue('pinned', JSON.stringify(pinnedElements));
	} else {
		unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.deleteSound.play();
		const elementDiv = Array.from(pinnedContainer.querySelectorAll('.item')).find(
			(el) => el.childNodes[1].textContent?.trim() === element.text,
		);
		elementDiv?.remove();
		if (pinnedElements.length === 1) pinnedContainer.style.display = 'none';
		pinnedElements = pinnedElements.filter((el) => el !== element);
		await GM.setValue('pinned', JSON.stringify(pinnedElements));
	}
}
export async function resetPinnedElements() {
	pinnedContainer.innerHTML = '';
	pinnedContainer.appendChild(pinnedTitle);
	pinnedContainer.style.display = 'none';
	pinnedElements = [];
	await GM.setValue('pinned', '[]');
}

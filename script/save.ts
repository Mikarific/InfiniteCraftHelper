import type { elements } from './index';

import { downloadIcon, uploadIcon } from './lib/assets';

import { addElementToDiscoveries, resetDiscoveries } from './discoveries';
import { pinElement, pinnedElements, resetPinnedElements } from './pinned';
import { addElementToCrafts, recipes, resetCrafts } from './crafts';

declare const window: any;

export function init(elements: elements) {
	const uploadContainer = document.createElement('label');
	uploadContainer.setAttribute('for', 'import-save');
	uploadContainer.classList.add('setting');

	const uploadInput = document.createElement('input');
	uploadInput.type = 'file';
	uploadInput.id = 'import-save';
	uploadContainer.appendChild(uploadInput);

	const uploadText = document.createTextNode('Import Save File');
	uploadContainer.appendChild(uploadText);

	const uploadImage = document.createElement('img');
	uploadImage.src = uploadIcon.trim();
	uploadContainer.appendChild(uploadImage);

	elements.settingsContent.appendChild(uploadContainer);
	uploadInput.addEventListener('change', async () => {
		const file = uploadInput.files !== null ? uploadInput.files[0] : null;
		if (file === null || file.type !== 'application/json') return;
		const fileContents = JSON.parse(await file.text());
		if (!Object.keys(fileContents).includes('elements')) return;

		const saveFile: {
			text: string;
			emoji?: string;
			discovered: boolean;
		}[] = [];

		for (const element of fileContents.elements) {
			if (!Object.keys(element).includes('text')) continue;
			const toPush: {
				text: string;
				emoji?: string;
				discovered: boolean;
			} = {
				text: element.text,
				discovered: !Object.keys(element).includes('discovered')
					? Object.keys(fileContents).includes('discoveries')
						? fileContents.discoveries.includes(element.text)
						: false
					: element.discovered,
			};
			if (Object.keys(element).includes('emoji')) toPush.emoji = element.emoji;
			saveFile.push(toPush);
		}

		localStorage.setItem(
			'infinite-craft-data',
			JSON.stringify({
				elements: saveFile,
			}),
		);

		window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements = saveFile;

		await resetCrafts();
		if (Object.keys(fileContents).includes('recipes')) {
			for (const recipeKey of Object.keys(fileContents.recipes)) {
				for (const recipe of fileContents.recipes[recipeKey]) {
					addElementToCrafts(
						{
							text: recipe[0].text,
							emoji: recipe[0].emoji,
						},
						{
							text: recipe[1].text,
							emoji: recipe[1].emoji,
						},
						recipeKey,
					);
				}
			}
		}

		await resetDiscoveries();
		const discoveredElements =
			window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements.filter(
				(el: { text: string; emoji?: string; discovered: boolean }) => el.discovered === true,
			);
		for (const discoveredElement of discoveredElements) {
			addElementToDiscoveries(discoveredElement);
		}

		await resetPinnedElements();
		if (Object.keys(fileContents).includes('pinned')) {
			for (const pinnedElement of fileContents.pinned) {
				pinElement(pinnedElement);
			}
		}
	});

	const downloadContainer = document.createElement('div');
	downloadContainer.classList.add('setting');

	const downloadText = document.createTextNode('Export Save File');
	downloadContainer.appendChild(downloadText);

	const downloadImage = document.createElement('img');
	downloadImage.src = downloadIcon.trim();
	downloadContainer.appendChild(downloadImage);

	elements.settingsContent.appendChild(downloadContainer);
	downloadContainer.addEventListener('click', (e) => {
		const saveFile = JSON.parse(localStorage.getItem('infinite-craft-data') ?? '');
		saveFile.pinned = pinnedElements;
		saveFile.recipes = recipes;

		const downloadLink = document.createElement('a');
		downloadLink.download = 'infinitecraft.json';
		downloadLink.href = URL.createObjectURL(
			new Blob([JSON.stringify(saveFile, null, '\t')], {
				type: 'application/json',
			}),
		);
		downloadLink.dataset.downloadurl = ['application/json', downloadLink.download, downloadLink.href].join(':');
		downloadLink.style.display = 'none';
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
		setTimeout(function () {
			URL.revokeObjectURL(downloadLink.href);
		}, 1500);
	});
}

import type { elements } from './index';

declare const window: any;

function exportState() {
	return {
		discoveries: window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.discoveries,
		elements: window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements,
	};
}

export async function init(domElements: elements) {
	if (domElements.instruction !== null) {
		const importState = document.createElement('button');
		importState.innerText = 'Import State';
		importState.classList.add('import-state');
		domElements.instruction.innerHTML = '';
		domElements.instruction.appendChild(importState);
		domElements.instruction.appendChild(document.createTextNode('Crafting any elements will overwrite your state!'));

		importState.addEventListener('click', async (e) => {
			const discoveries = await GM.getValue('discoveries');
			const elements = await GM.getValue('elements');
			if (discoveries !== undefined && elements !== undefined) {
				const gameData = window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data;
				gameData.discoveries = discoveries;
				gameData.elements = elements;
				domElements.instruction.remove();
			}
		});
	}

	const observer = new MutationObserver(async () => {
		const { discoveries, elements } = exportState();
		await GM.setValue('discoveries', discoveries);
		await GM.setValue('elements', elements);
	});
	observer.observe(domElements.sidebar, { childList: true, subtree: true });

	const discoveries = await GM.getValue('discoveries');
	const elements = await GM.getValue('elements');
	if (discoveries === undefined || elements === undefined) {
		const oldState = await GM.getValue('state');
		if (oldState !== undefined) {
			const oldStateParsed = JSON.parse(oldState as string);
			await GM.setValue('discoveries', oldStateParsed.discoveries);
			await GM.setValue('elements', oldStateParsed.elements);
			await GM.deleteValue('state');
		} else {
			const initialState = exportState();
			await GM.setValue('discoveries', initialState.discoveries);
			await GM.setValue('elements', initialState.elements);
		}
	}
}

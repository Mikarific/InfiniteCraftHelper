declare const window: any;

function exportState() {
	return JSON.stringify({
		discoveries: window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.discoveries,
		elements: window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements,
	});
}

export async function init() {
	const instruction = document.querySelector('.instruction');
	if (instruction !== null) {
		const importState = document.createElement('button');
		importState.innerText = 'Import State';
		importState.classList.add('import-state');
		instruction.innerHTML = '';
		instruction.appendChild(importState);
		instruction.appendChild(document.createTextNode('Crafting any elements will overwrite your state!'));

		importState.addEventListener('click', async (e) => {
			const state = await GM.getValue('state');
			if (typeof state === 'string') {
				const { discoveries, elements } = JSON.parse(state);
				const gameData = window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data;
				gameData.discoveries = discoveries;
				gameData.elements = elements;
			}
			instruction.remove();
		});
	}

	const observer = new MutationObserver(async (mutations) => {
		await GM.setValue('state', exportState());
	});
	observer.observe(document.querySelector('.sidebar') as HTMLDivElement, { childList: true, subtree: true });

	const state = await GM.getValue('state');
	if (state === undefined) {
		await GM.setValue('state', exportState());
	}
}

import type { elements } from '../index';

import { setMiddleClickOnMutations } from '../copy';
import { addElementToDiscoveries } from '../discoveries';
import { contributeToDatabase } from '../settings';
import { pinElement, resetPinnedElements } from '../pinned';
import { addElementToCrafts, openCraftsForElement, resetCrafts } from '../crafts';

declare const GM: any;
declare const unsafeWindow: any;
declare const exportFunction: any;

export function init(elements: elements) {
	// Detect when fetch is monkeypatched because a certain someone made a tool to upload fake recipes.
	const iframe = document.createElement('iframe');
	document.body.appendChild(iframe);
	const cleanFetch = iframe.contentWindow?.fetch?.toString() ?? '';
	iframe.remove();

	// New Element Crafted
	const getCraftResponse = unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].getCraftResponse;
	unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].getCraftResponse = exportFunction(
		(...args: any) =>
			new window.Promise(async (resolve: Function) => {
				const response = await getCraftResponse(...args);
				const args0 = args[0].wrappedJSObject === undefined ? args[0] : args[0].wrappedJSObject;
				const args1 = args[1].wrappedJSObject === undefined ? args[1] : args[1].wrappedJSObject;
				const ingredients = args0.text.localeCompare(args1.text, 'en') === -1 ? [args0, args1] : [args1, args0];

				const first = ingredients[0];
				const second = ingredients[1];
				const result = {
					text: response.result,
					emoji: response.emoji,
					discovered: response.isNew,
				};

				if (first.text === '') return resolve(response);
				if (second.text === '') return resolve(response);
				if (result.text === '' || result.text === 'Nothing') return resolve(response);

				if (contributeToDatabase && unsafeWindow.fetch.toString() === cleanFetch) {
					GM.xmlHttpRequest({
						method: 'POST',
						url: `https://infinitecraft.mikarific.com/recipe`,
						data: JSON.stringify({
							first: {
								text: first.text,
								emoji: first.emoji,
							},
							second: {
								text: second.text,
								emoji: second.emoji,
							},
							result: {
								text: result.text,
								emoji: result.emoji,
							},
						}),
						headers: {
							'Content-Type': 'application/json',
							Origin: 'https://neal.fun/infinite-craft/',
						},
					});
				}

				addElementToCrafts(
					{
						text: first.text,
						emoji: first.emoji,
					},
					{
						text: second.text,
						emoji: second.emoji,
					},
					result.text,
				);

				if (result.discovered) {
					addElementToDiscoveries(result);
				}

				console.log(`${first.text} + ${second.text} = ${result.text}`);

				resolve(response);
			}),
		unsafeWindow,
	);

	const selectElement = unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].selectElement;
	unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].selectElement = exportFunction(
		(e: MouseEvent, element: { text: string; emoji?: string; discovered: boolean; wrappedJSObject?: any }) => {
			element = element.wrappedJSObject === undefined ? element : element.wrappedJSObject;
			if (e.button === 2) {
				openCraftsForElement(element);
				return;
			}
			if (e.altKey) {
				pinElement(element);
				return;
			}
			return selectElement(e, element);
		},
		unsafeWindow,
	);

	const instanceObserver = new MutationObserver((mutations) => {
		setMiddleClickOnMutations(mutations, elements);
	});
	instanceObserver.observe(elements.instances, { childList: true, subtree: true });

	const oldResetButton = document.querySelector('.reset') as HTMLDivElement;
	const resetButton = oldResetButton.cloneNode(true);
	oldResetButton.parentNode?.replaceChild(resetButton, oldResetButton);
	resetButton.addEventListener('click', async () => {
		const confirmation = confirm('Are you sure? This will delete all your progress!');
		if (confirmation) {
			localStorage.removeItem('infinite-craft-data');
			await resetPinnedElements();
			await resetCrafts();
			location.reload();
		}
	});
}

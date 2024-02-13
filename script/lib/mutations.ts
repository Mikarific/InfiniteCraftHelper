import type { elements } from '../index';

import { setMiddleClickOnMutations } from '../copy';
import { addElementToDiscoveries } from '../discoveries';
import { contributeToDatabase } from '../settings';
import { pinElement, resetPinnedElements } from '../pinned';
import { addElementToCrafts, openCraftsForElement, resetCrafts } from '../crafts';

declare const window: any;

export function init(elements: elements) {
	// New Element Crafted
	const getCraftResponse = window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].getCraftResponse;
	window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].getCraftResponse = async (...args: any) => {
		const response = await getCraftResponse(...args);
		const first = args[0];
		const second = args[1];
		const result = response;
		if (contributeToDatabase) {
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
						text: result.result,
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
			result.result,
		);
		if (result.isNew) {
			addElementToDiscoveries({
				text: result.result,
				emoji: result.emoji,
				discovered: result.isNew,
			});
		}
		console.log(`${first.text} + ${second.text} = ${result.result}`);
		return response;
	};

	const selectElement = window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].selectElement;
	window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].selectElement = (
		e: MouseEvent,
		element: { text: string; emoji?: string; discovered: boolean },
	) => {
		if (e.button === 2) return openCraftsForElement(element);
		if (e.altKey) return pinElement(element);
		return selectElement(e, element);
	};

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

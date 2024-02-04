import { setMiddleClickOnMutations } from '../copy';
import { prepareNewElementToSort, addNewElementToSort } from './sort';
import type { elements } from '../index';

declare const window: any;

export function init(elements: elements) {
	// New Element Crafted
	const getCraftResponse = window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].getCraftResponse;
	window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].getCraftResponse = async (...args: any) => {
		const response = await getCraftResponse(...args);
		const first = args[0];
		const second = args[1];
		const result = response.result;
		prepareNewElementToSort(result);
		return response;
	};
	// New Element Added to DOM
	const newElementObserver = new MutationObserver((mutations) => {
		addNewElementToSort(mutations, elements);
	});
	newElementObserver.observe(elements.items, { childList: true, subtree: true });

	// New Instance Added to DOM
	const instanceObserver = new MutationObserver((mutations) => {
		setMiddleClickOnMutations(mutations, elements);
	});
	instanceObserver.observe(elements.instances, { childList: true, subtree: true });
}

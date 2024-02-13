import type { elements } from './index';

import { matchSorter } from './lib/match';

declare const window: any;

export function init(elements: elements) {
	window.addEventListener('keydown', () => {
		if (document.activeElement !== elements.searchBar) {
			elements.searchBar.focus();
		}
	});
	elements.searchBar.addEventListener('input', (e) => {
		if (
			(e as InputEvent).inputType === 'insertText' &&
			window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.searchQuery.trim().length === 1
		) {
			elements.sidebar.scrollTo(0, 0);
		}
	});
	window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._computedWatchers.sortedElements.getter =
		() => {
			const query = window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.searchQuery.trim();
			if (query === '') {
				return window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements;
			} else {
				return matchSorter(
					window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements,
					window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.searchQuery,
					{
						keys: ['text'],
					},
				);
			}
		};
}

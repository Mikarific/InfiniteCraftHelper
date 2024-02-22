import type { elements } from './index';

import { matchSorter } from './lib/match';

declare const unsafeWindow: any;
declare const cloneInto: any;
declare const exportFunction: any;

export function init(elements: elements) {
	elements.sidebarHeader.prepend(elements.searchBar);
	window.addEventListener('keydown', () => {
		if (document.activeElement !== elements.searchBar) {
			elements.searchBar.focus();
		}
	});
	elements.searchBar.addEventListener('input', (e) => {
		if (
			(e as InputEvent).inputType === 'insertText' &&
			unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.searchQuery.trim().length === 1
		) {
			elements.sidebar.scrollTo(0, 0);
		}
	});
	unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._computedWatchers.sortedElements.getter =
		exportFunction(() => {
			const query = unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.searchQuery.trim();
			if (query === '') {
				const elements = [...unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements];
				if (unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.showDiscoveredOnly) {
					return cloneInto(
						elements.filter((el: { text: string; emoji?: string; discovered: boolean }) => el.discovered),
						unsafeWindow,
					);
				}
				if (unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.sortBy === 'name') {
					return cloneInto(elements, unsafeWindow).sort(
						(
							a: { text: string; emoji?: string; discovered: boolean },
							b: { text: string; emoji?: string; discovered: boolean },
						) => a.text.localeCompare(b.text, undefined, { numeric: true }),
					);
				}
				if (unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.sortBy === 'emoji') {
					return cloneInto(elements, unsafeWindow).sort(
						(
							a: { text: string; emoji?: string; discovered: boolean },
							b: { text: string; emoji?: string; discovered: boolean },
						) => {
							const emojiA = a.emoji ?? '⬜';
							const emojiB = b.emoji ?? '⬜';
							return emojiA.localeCompare(emojiB);
						},
					);
				}
				return unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements;
			} else {
				return cloneInto(
					matchSorter(
						cloneInto(unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements, unsafeWindow),
						unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.searchQuery,
						{
							keys: ['text'],
						},
					),
					unsafeWindow,
				);
			}
		}, unsafeWindow);
}

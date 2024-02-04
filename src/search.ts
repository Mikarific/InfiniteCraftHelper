import type { elements } from './index';

import { matchSorter } from './lib/match';
import * as sort from './lib/sort';

declare const window: any;

function sortElementsInDom(sorted: HTMLDivElement[], itemsListElement: HTMLDivElement) {
	let previousElement: HTMLDivElement | null = null;
	for (const item of sorted) {
		item.classList.remove('search-hidden');
		if (previousElement !== null) {
			previousElement.after(item);
		} else {
			itemsListElement.prepend(item);
		}
		previousElement = item;
	}
}

export function init(elements: elements) {
	const searchBar = document.createElement('input');
	searchBar.type = 'text';
	searchBar.placeholder = 'Search...';
	searchBar.classList.add('search-bar');
	elements.searchBarContainer.appendChild(searchBar);

	searchBar.addEventListener('input', (e) => {
		const query = (e.target as HTMLInputElement).value;
		const items = elements.getItems();
		if (query !== '') {
			for (const item of items) {
				item.classList.add('search-hidden');
			}
			const sorted = matchSorter(items, query, { keys: [(item) => item.childNodes[1].textContent?.trim() ?? ''] });
			sortElementsInDom(sorted, elements.items);
			if ((e as InputEvent).inputType === 'insertText' && query.length === 1) {
				elements.sidebar.scrollTo(0, 0);
			}
		} else {
			sortElementsInDom(Array.from(sort.sortedByTime), elements.items);
		}
	});
}

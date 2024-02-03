import type { elements } from './index';

import { matchSorter } from './lib/sort';

export function init(elements: elements) {
	const searchBarContainer = document.createElement('div');
	searchBarContainer.classList.add('search-bar-container');
	elements.sidebar.prepend(searchBarContainer);

	const searchBar = document.createElement('input');
	searchBar.type = 'text';
	searchBar.placeholder = 'Search...';
	searchBar.classList.add('search-bar');
	searchBarContainer.appendChild(searchBar);

	elements.sidebarControls.style.backgroundColor = '#fff';

	searchBar.addEventListener('input', (e) => {
		const query = (e.target as HTMLInputElement).value;
		const items = elements.getItems();
		if (query !== '') {
			items.forEach((item) => {
				item.style.display = 'none';
			});
			const sorted = matchSorter(items, query, { keys: [(item) => item.childNodes[1].textContent?.trim() ?? ''] });
			let previousElement: HTMLDivElement | null = null;
			sorted.forEach((item) => {
				item.style.display = '';
				if (previousElement !== null) {
					previousElement.after(item);
				} else {
					elements.items.prepend(item);
				}
				previousElement = item;
			});
			if ((e as InputEvent).inputType === 'insertText' && query.length === 1) {
				elements.sidebar.scrollTo(0, 0);
			}
		} else {
			items.forEach((item) => {
				item.style.display = '';
			});
			elements.sort.click();
			setTimeout(() => {
				elements.sort.click();
			}, 1);
		}
	});
}

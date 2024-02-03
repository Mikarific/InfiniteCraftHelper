import { matchSorter } from './lib/sort';

export function init() {
	const searchBarContainer = document.createElement('div');
	searchBarContainer.classList.add('search-bar-container');
	document.querySelector('.sidebar')?.prepend(searchBarContainer);

	const searchBar = document.createElement('input');
	searchBar.type = 'text';
	searchBar.placeholder = 'Search...';
	searchBar.classList.add('search-bar');
	searchBarContainer.appendChild(searchBar);

	(document.querySelector('.sidebar-controls') as HTMLDivElement).style.backgroundColor = '#fff';

	searchBar.addEventListener('input', (e) => {
		const query = (e.target as HTMLInputElement).value;
		const elements = [...document.querySelectorAll('.items div.item')];
		if (query !== '') {
			elements.forEach((element) => {
				(element as HTMLDivElement).style.display = 'none';
			});
			const sorted = matchSorter(elements, query, { keys: [(element) => ((element as HTMLDivElement).childNodes[1] as Text).textContent?.trim() ?? ''] });
			let previousElement: HTMLDivElement | null = null;
			console.log(sorted.map((element) => ((element as HTMLDivElement).childNodes[1] as Text).textContent?.trim()));
			sorted.forEach((element) => {
				(element as HTMLDivElement).style.display = '';
				if (previousElement !== null) {
					previousElement.after(element);
				} else {
					document.querySelector('.items')?.prepend(element);
				}
				previousElement = element as HTMLDivElement;
			});
		} else {
			elements.forEach((element) => {
				(element as HTMLDivElement).style.display = '';
			});
			(document.querySelector('.sort') as HTMLDivElement).click();
			setTimeout(() => {
				(document.querySelector('.sort') as HTMLDivElement).click();
			}, 1);
		}
	});
}

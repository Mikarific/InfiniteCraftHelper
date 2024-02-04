import * as styles from './styles';
import * as mutations from './lib/mutations';
import * as sort from './lib/sort';

import * as search from './search';
import * as state from './state';
import * as copy from './copy';

import * as settings from './settings';
import * as download from './download';
import * as theme from './theme';
import * as logo from './logo';

export type elements = {
	styles: HTMLStyleElement;
	instances: HTMLDivElement;
	sidebar: HTMLDivElement;
	searchBarContainer: HTMLDivElement;
	settingsContent: HTMLDivElement;
	items: HTMLDivElement;
	getItems: () => HTMLDivElement[];
	instruction: HTMLDivElement;
	sidebarControls: HTMLDivElement;
	sort: HTMLDivElement;
	particles: HTMLCanvasElement;
	logo: HTMLImageElement;
};

window.addEventListener(
	'load',
	async () => {
		const searchBarContainer = document.createElement('div');
		searchBarContainer.classList.add('search-bar-container');
		document.querySelector('.sidebar')?.prepend(searchBarContainer);
		const settingsContent = document.createElement('div');
		settingsContent.classList.add('settings-content');
		const elements: elements = {
			styles: document.createElement('style'),
			instances: document.querySelector('.instances') as HTMLDivElement,
			sidebar: document.querySelector('.sidebar') as HTMLDivElement,
			searchBarContainer: searchBarContainer,
			settingsContent: settingsContent,
			items: document.querySelector('.items') as HTMLDivElement,
			getItems: () => {
				return Array.from(document.querySelectorAll('.items div.item'));
			},
			instruction: document.querySelector('.instruction') as HTMLDivElement,
			sidebarControls: document.querySelector('.sidebar-controls') as HTMLDivElement,
			sort: document.querySelector('.sort') as HTMLDivElement,
			particles: document.querySelector('.particles') as HTMLCanvasElement,
			logo: document.querySelector('.logo') as HTMLImageElement,
		};

		styles.init(elements);
		mutations.init(elements);
		sort.init(elements);

		search.init(elements);
		await state.init(elements);
		copy.init();

		settings.init(elements);
		download.init(elements);
		theme.init(elements);
		logo.init(elements);
	},
	false,
);

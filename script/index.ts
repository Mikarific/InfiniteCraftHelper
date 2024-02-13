import * as styles from './styles';
import * as mutations from './lib/mutations';
import * as settings from './settings';
import * as save from './save';
import * as search from './search';
import * as pinned from './pinned';
import * as random from './random';
import * as discoveries from './discoveries';
import * as crafts from './crafts';
import * as theme from './theme';
import * as logo from './logo';

export type elements = {
	container: HTMLDivElement;
	styles: HTMLStyleElement;
	instances: HTMLDivElement;
	sideControls: HTMLDivElement;
	sidebar: HTMLDivElement;
	searchBar: HTMLInputElement;
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
		const settingsContent = document.createElement('div');
		settingsContent.classList.add('settings-content');
		const elements: elements = {
			container: document.querySelector('.container') as HTMLDivElement,
			styles: document.createElement('style'),
			instances: document.querySelector('.instances') as HTMLDivElement,
			sideControls: document.querySelector('.side-controls') as HTMLDivElement,
			sidebar: document.querySelector('.sidebar') as HTMLDivElement,
			searchBar: document.querySelector('.sidebar-input') as HTMLInputElement,
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
		elements.items.before(elements.sidebarControls);

		styles.init(elements);
		mutations.init(elements);
		settings.init(elements);
		save.init(elements);
		search.init(elements);
		pinned.init(elements);
		random.init(elements);
		await crafts.init(elements);
		discoveries.init(elements);
		theme.init(elements);
		logo.init(elements);
	},
	false,
);

window.addEventListener('contextmenu', (e) => {
	e.preventDefault();
});

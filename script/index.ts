import * as outdated from './outdated';
import * as favicon from './favicon';
import * as styles from './styles';
import * as mutations from './lib/mutations';
import * as settings from './settings';
import * as expand from './expand';
import * as save from './save';
import * as search from './search';
import * as pinned from './pinned';
import * as random from './random';
import * as discoveries from './discoveries';
import * as crafts from './crafts';
import * as logo from './logo';
import * as shadow from './shadow';

declare const unsafeWindow: any;
declare const cloneInto: any;

export type elements = {
	favicon: HTMLLinkElement;
	container: HTMLDivElement;
	instances: HTMLDivElement;
	styles: HTMLStyleElement;
	sideControls: HTMLDivElement;
	darkModeIcon: HTMLImageElement;
	sidebar: HTMLDivElement;
	sidebarHeader: HTMLDivElement;
	searchBar: HTMLInputElement;
	settingsContent: HTMLDivElement;
	items: HTMLDivElement;
	getItems: () => HTMLDivElement[];
	instruction: HTMLDivElement;
	sort: HTMLDivElement;
	particles: HTMLCanvasElement;
	logo: HTMLImageElement;
};

window.addEventListener(
	'load',
	async () => {
		const sidebarHeader = document.createElement('div');
		sidebarHeader.classList.add('sidebar-header');

		const settingsContent = document.createElement('div');
		settingsContent.classList.add('settings-content');

		const elements: elements = {
			favicon: document.querySelector('link[rel="icon"]') as HTMLLinkElement,
			container: document.querySelector('.container') as HTMLDivElement,
			instances: document.querySelector('.instances') as HTMLDivElement,
			styles: document.createElement('style'),
			sideControls: document.querySelector('.side-controls') as HTMLDivElement,
			darkModeIcon: document.querySelector('.dark-mode-icon') as HTMLImageElement,
			sidebar: document.querySelector('.sidebar') as HTMLDivElement,
			sidebarHeader: sidebarHeader,
			searchBar: document.querySelector('.sidebar-search') as HTMLInputElement,
			settingsContent: settingsContent,
			items: document.querySelector('.items') as HTMLDivElement,
			getItems: () => {
				return Array.from(document.querySelectorAll('.items div.item'));
			},
			instruction: document.querySelector('.instruction') as HTMLDivElement,
			sort: document.querySelector('.sort') as HTMLDivElement,
			particles: document.querySelector('.particles') as HTMLCanvasElement,
			logo: document.querySelector('.logo') as HTMLImageElement,
		};
		elements.items.before(elements.sidebarHeader);

		outdated.init(elements);
		favicon.init(elements);
		styles.init(elements);
		mutations.init(elements);
		settings.init(elements);
		expand.init(elements);
		save.init(elements);
		search.init(elements);
		pinned.init(elements);
		random.init(elements);
		await crafts.init(elements);
		discoveries.init(elements);
		logo.init(elements);
		shadow.init(elements);
	},
	false,
);

window.addEventListener('contextmenu', (e) => {
	e.preventDefault();
});

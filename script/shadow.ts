import type { elements } from './index';
import { shadowIcon } from './lib/assets';

declare const unsafeWindow: any;
declare const exportFunction: any;

let theme = 'shadow';

const shadowCSS = `
    .container.dark-mode {
		--border-color: #525252 !important;
        --item-bg: #18181b !important;
        --instance-bg: linear-gradient(180deg,#22252b,#18181b 80%) !important;
        --instance-bg-hover: linear-gradient(180deg,#3d4249,#18181b 80%) !important;
        --instance-border: #525252 !important;
        --instance-border-hover: #a3a3a3 !important;
        --sidebar-bg: #18181b !important;
        --background-color: #18181b !important;
        --discoveries-bg-active: #423a24 !important;
        --text-color: #fff !important;
	}

    .dark-mode {
        scrollbar-color: #525252 #262626 !important;
    }

    .dark-mode .sidebar-controls:after {
        background: linear-gradient(180deg, rgba(24,24,27,0), rgba(24,24,27,.9)) !important;
    }
`;
const shadowStyles = document.createElement('style');
shadowStyles.appendChild(document.createTextNode(shadowCSS.trim()));

export async function init(elements: elements) {
	const oldTheme = localStorage.getItem('theme');
	if (oldTheme !== null && oldTheme === 'light') theme = 'light';
	localStorage.removeItem('theme');

	const storedTheme = await GM.getValue('theme');
	if (storedTheme === 'light') theme = 'light';
	if (storedTheme === 'dark') theme = 'dark';

	await GM.setValue('theme', theme);

	if (theme === 'light' && unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.isDarkMode) {
		unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].toggleDarkMode();
	} else if (theme === 'shadow' && !unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.isDarkMode) {
		unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].toggleDarkMode();
	} else if (theme === 'dark' && !unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.isDarkMode) {
		unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].toggleDarkMode();
	}

	if (theme === 'shadow') {
		document.getElementsByTagName('head')[0].appendChild(shadowStyles);
	}

	const darkModeIcon = elements.darkModeIcon.cloneNode(true) as HTMLImageElement;
	darkModeIcon.src = shadowIcon;
	if (theme === 'light') darkModeIcon.src = '/infinite-craft/dark-mode.svg';
	if (theme === 'dark') darkModeIcon.src = '/infinite-craft/dark-mode-on.svg';
	elements.darkModeIcon.parentNode?.replaceChild(darkModeIcon, elements.darkModeIcon);

	const toggleDarkMode = unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].toggleDarkMode;
	unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].toggleDarkMode = exportFunction(async () => {
		if (theme === 'light') {
			toggleDarkMode();
			darkModeIcon.src = shadowIcon;
			document.getElementsByTagName('head')[0].appendChild(shadowStyles);
			theme = 'shadow';
		} else if (theme === 'shadow') {
			darkModeIcon.src = '/infinite-craft/dark-mode-on.svg';
			shadowStyles.remove();
			theme = 'dark';
		} else if (theme === 'dark') {
			toggleDarkMode();
			darkModeIcon.src = '/infinite-craft/dark-mode.svg';
			theme = 'light';
		}
		await GM.setValue('theme', theme);
	}, unsafeWindow);

	darkModeIcon.addEventListener(
		'click',
		unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].toggleDarkMode,
	);
}

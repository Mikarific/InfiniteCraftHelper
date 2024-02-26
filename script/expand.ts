import type { elements } from './index';

declare const unsafeWindow: any;
declare const exportFunction: any;

let sidebarSize = 0;

let resizing = false;

function onResize() {
	sidebarSize =
		window.innerWidth > 800 ? Math.min(Math.min(Math.max(sidebarSize, 305), 900), window.innerWidth - 100) : 0;
	document.documentElement.style.setProperty('--sidebar-size', `${sidebarSize}px`);
	unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.sidebarSize = sidebarSize;
	for (const instance of unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.instances) {
		instance.width || unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].calcInstanceSize(instance),
			instance.left + instance.width + 10 > window.innerWidth - sidebarSize &&
				unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].setInstancePosition(
					instance,
					window.innerWidth - sidebarSize - instance.width - 10,
					instance.top,
				),
			instance.top + instance.height + 10 > window.innerHeight &&
				unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].setInstancePosition(
					instance,
					instance.left,
					window.innerHeight - instance.height - 10,
				);
	}
	unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].checkControlsBlur();
}

export function init(elements: elements) {
	sidebarSize =
		window.innerWidth > 800
			? unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.sidebarSize > 310
				? 350
				: 305
			: 0;
	document.documentElement.style.setProperty('--sidebar-size', `${sidebarSize}px`);

	const resizeBar = document.createElement('div');
	resizeBar.classList.add('resize-bar');
	elements.sidebar.after(resizeBar);

	resizeBar.addEventListener('mousedown', () => {
		resizing = true;
	});

	window.addEventListener('mousemove', (e) => {
		if (resizing) {
			sidebarSize =
				window.innerWidth > 800
					? Math.min(Math.min(Math.max(window.innerWidth - e.clientX, 305), 900), window.innerWidth - 100)
					: 13;
			unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.sidebarSize = sidebarSize;
			document.documentElement.style.setProperty('--sidebar-size', `${sidebarSize}px`);
			onResize();
		}
	});

	window.addEventListener('mouseup', () => {
		resizing = false;
	});

	window.removeEventListener('resize', unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].onResize);
	window.addEventListener('resize', onResize);
}

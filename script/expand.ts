import type { elements } from './index';

declare const unsafeWindow: any;
declare const exportFunction: any;

let sidebarSize = 0;

let resizing = false;

export function init(elements: elements) {
	sidebarSize = unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.sidebarSize > 310 ? 350 : 305;
	document.documentElement.style.setProperty('--sidebar', `${sidebarSize}px`);

	const resizeBar = document.createElement('div');
	resizeBar.classList.add('resize-bar');
	elements.sidebar.after(resizeBar);

	resizeBar.addEventListener('mousedown', () => {
		resizing = true;
	});

	window.addEventListener('mousemove', (e) => {
		if (resizing) {
			sidebarSize = Math.min(Math.min(Math.max(window.innerWidth - e.clientX, 305), 900), window.innerWidth - 100);
			unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.sidebarSize = sidebarSize;
			document.documentElement.style.setProperty('--sidebar', `${sidebarSize}px`);

			for (const instance of unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.instances) {
				unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].dropElement(instance);
			}
		}
	});

	window.addEventListener('mouseup', () => {
		resizing = false;
	});

	window.removeEventListener('resize', unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].onResize);
	window.addEventListener('resize', () => {
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
	});
}

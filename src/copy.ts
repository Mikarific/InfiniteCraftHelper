import type { elements } from './index';

declare const window: any;

export function setMiddleClickOnMutations(mutations: MutationRecord[], elements: elements) {
	for (const mutation of mutations) {
		if (mutation.addedNodes.length > 0) {
			for (const node of mutation.addedNodes) {
				node.addEventListener('mousedown', (e) => {
					e.preventDefault();
					if (e instanceof MouseEvent && (e as MouseEvent).button === 1 && e.target instanceof HTMLDivElement && e.target.childNodes.length >= 2) {
						window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].playInstanceSound();
						const targetElement = e.target as HTMLDivElement;
						const { x, y, width, height } = targetElement.getBoundingClientRect();
						const data = {
							id: window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.instanceId,
							text: targetElement.childNodes[1].textContent?.trim(),
							emoji: targetElement.childNodes[0].textContent?.trim(),
							discovered: targetElement.classList.contains('instance-discovered'),
							disabled: false,
							left: x,
							top: y,
							offsetX: 0.5,
							offsetY: 0.5,
						};
						window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.selectedInstance = data;
						window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.instances.push(window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.selectedInstance);

						window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].$nextTick(() => {
							window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].setInstancePosition(window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.selectedInstance, e.clientX - width / 2, e.clientY - height / 2);
							window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].setInstanceZIndex(window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.selectedInstance, data.id);
						});
					}
				});
			}
		}
	}
}

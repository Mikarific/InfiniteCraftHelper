import type { elements } from './index';

import { randomIcon } from './lib/assets';

declare const unsafeWindow: any;
declare const cloneInto: any;
declare const exportFunction: any;

export function init(elements: elements) {
	const randomImage = document.createElement('img');
	randomImage.src = randomIcon.trim();
	randomImage.classList.add('random');
	elements.sideControls.appendChild(randomImage);
	randomImage.addEventListener('click', (e) => {
		unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].playInstanceSound();
		const randomElement =
			unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements[
				Math.floor(
					Math.random() * unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements.length,
				)
			];
		const data = {
			id: unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.instanceId++,
			text: randomElement.text,
			emoji: randomElement.emoji,
			discovered: randomElement.discovered,
			disabled: false,
			left: 0,
			top: 0,
			offsetX: 0.5,
			offsetY: 0.5,
		};
		unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.selectedInstance = cloneInto(
			data,
			unsafeWindow,
		);
		unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.instances.push(
			unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.selectedInstance,
		);
		unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].$nextTick(
			exportFunction(() => {
				const randomPosition = Math.random() * Math.PI * 2;
				const cos = 50 * Math.cos(randomPosition);
				const sin = 50 * Math.sin(randomPosition);
				unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].setInstancePosition(
					unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.selectedInstance,
					(window.innerWidth - unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.sidebarSize) / 2 +
						cos,
					window.innerHeight / 2 - 40 + sin,
				);
				unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].setInstanceZIndex(
					unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.selectedInstance,
					data.id,
				);
				unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].calcInstanceSize(
					unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.selectedInstance,
				);
			}, unsafeWindow),
		);
	});
}

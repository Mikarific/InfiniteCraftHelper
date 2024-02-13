import type { elements } from './index';

import { randomIcon } from './lib/assets';

declare const window: any;

export function init(elements: elements) {
	const randomImage = document.createElement('img');
	randomImage.src = randomIcon.trim();
	randomImage.classList.add('random');
	elements.sideControls.appendChild(randomImage);
	randomImage.addEventListener('click', (e) => {
		window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].playInstanceSound();
		const randomElement =
			window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements[
				Math.floor(
					Math.random() * window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements.length,
				)
			];
		const data = {
			id: window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.instanceId++,
			text: randomElement.text,
			emoji: randomElement.emoji,
			discovered: randomElement.discovered,
			disabled: false,
			left: 0,
			top: 0,
			offsetX: 0.5,
			offsetY: 0.5,
		};
		window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.selectedInstance = data;
		window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.instances.push(
			window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.selectedInstance,
		);
		window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].$nextTick(() => {
			const randomPosition = Math.random() * Math.PI * 2;
			const cos = 50 * Math.cos(randomPosition);
			const sin = 50 * Math.sin(randomPosition);
			window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].setInstancePosition(
				window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.selectedInstance,
				(window.innerWidth - window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.sidebarSize) /
					2 +
					cos,
				window.innerHeight / 2 - 40 + sin,
			);
			window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].setInstanceZIndex(
				window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.selectedInstance,
				data.id,
			);
			window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0].calcInstanceSize(
				window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.selectedInstance,
			);
		});
	});
}

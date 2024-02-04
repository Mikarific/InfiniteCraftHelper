import type { elements } from './index';

let middleMouseDown = false;
let middleClickedElementString: string | null = null;
let teleportX = 0;
let teleportY = 0;

export function init() {
	document.addEventListener('mouseup', (e) => {
		if (e.button === 1) {
			middleMouseDown = false;
		}
	});
}

export function setMiddleClickOnMutations(mutations: MutationRecord[], elements: elements) {
	for (const mutation of mutations) {
		if (mutation.addedNodes.length > 0) {
			for (const node of mutation.addedNodes) {
				if (middleMouseDown && node instanceof HTMLDivElement && node.childNodes.length >= 2 && node.childNodes[1].textContent?.trim() === middleClickedElementString) {
					node.style.translate = `${teleportX - node.clientWidth / 2}px ${teleportY - node.clientHeight / 2}px`;
				}
				node.addEventListener('mousedown', (e) => {
					e.preventDefault();
					if (e instanceof MouseEvent && (e as MouseEvent).button === 1 && e.target instanceof HTMLDivElement && e.target.childNodes.length >= 2) {
						const targetElement = e.target as HTMLDivElement;
						targetElement.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
						middleClickedElementString = targetElement.childNodes[1].textContent?.trim() ?? null;
						const newElement = elements.getItems().find((el) => el.childNodes[1].textContent?.trim() === middleClickedElementString);
						const { x, y, width, height } = newElement?.getBoundingClientRect()!;
						newElement?.dispatchEvent(
							new MouseEvent('mousedown', {
								clientX: x + width / 2,
								clientY: y + height / 2,
							}),
						);
						middleMouseDown = true;
						teleportX = e.clientX;
						teleportY = e.clientY;
					}
				});
			}
		}
	}
}

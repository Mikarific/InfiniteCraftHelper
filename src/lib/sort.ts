import type { elements } from '../index';

declare const window: any;

let nextElementToAdd: string | null = null;
export let sortedByTime: Set<HTMLDivElement> = new Set();

export function init(elements: elements) {
	sortedByTime = new Set(
		window.unsafeWindow.$nuxt.$root.$children[2].$children[0].$children[0]._data.elements.map((item: { emoji: string; text: string }) => {
			return elements.getItems().find((el) => el.childNodes[1].textContent?.trim() === item.text);
		}),
	);
}

export function prepareNewElementToSort(element: string) {
	nextElementToAdd = element;
}

export function addNewElementToSort(mutations: MutationRecord[], elements: elements) {
	for (const mutation of mutations) {
		if (mutation.addedNodes.length >= 1) {
			for (const node of mutation.addedNodes) {
				if (node instanceof HTMLDivElement && node.childNodes.length >= 2 && nextElementToAdd !== null && node.childNodes[1].textContent?.trim() === nextElementToAdd) {
					sortedByTime.add(node);
					nextElementToAdd = null;
				}
			}
		}
	}
}

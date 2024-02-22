import type { elements } from './index';

import { closeIcon } from './lib/assets';

const craftsModal = document.createElement('dialog');
const craftsTitle = document.createElement('h1');
const craftsContainer = document.createElement('div');

export let recipes: {
	[key: string]: [{ text: string; emoji: string }, { text: string; emoji: string }][];
} = {};

export async function init(elements: elements) {
	craftsModal.classList.add('modal');
	elements.container.appendChild(craftsModal);

	const craftsHeader = document.createElement('div');
	craftsHeader.classList.add('modal-header');

	craftsTitle.classList.add('modal-title');
	craftsTitle.appendChild(document.createTextNode('Crafts'));
	craftsHeader.appendChild(craftsTitle);

	const closeButton = document.createElement('img');
	closeButton.src = closeIcon.trim();
	closeButton.classList.add('close-button');
	craftsHeader.appendChild(closeButton);

	craftsModal.appendChild(craftsHeader);

	craftsContainer.classList.add('crafts-container');
	craftsModal.appendChild(craftsContainer);

	recipes = JSON.parse(((await GM.getValue('recipes')) as string) ?? '{}');

	closeButton.addEventListener('click', (e) => {
		craftsModal.close();
	});
}

export async function addElementToCrafts(
	first: { text: string; emoji?: string },
	second: { text: string; emoji?: string },
	result: string,
) {
	const ingredients = [first, second].sort((a, b) => {
		return a.text.localeCompare(b.text);
	});
	if (recipes[result] === undefined) recipes[result] = [];
	if (
		recipes[result].find(
			(recipe) => recipe[0].text === ingredients[0].text && recipe[1].text === ingredients[1].text,
		) !== undefined
	)
		return;
	recipes[result].push([
		{
			text: ingredients[0].text,
			emoji: ingredients[0].emoji ?? '⬜',
		},
		{
			text: ingredients[1].text,
			emoji: ingredients[1].emoji ?? '⬜',
		},
	]);
	await GM.setValue('recipes', JSON.stringify(recipes));
}

export function openCraftsForElement(element: { text: string; emoji?: string }) {
	craftsTitle.innerHTML = '';
	const titleEmoji = document.createElement('span');
	titleEmoji.classList.add('display-item-emoji');
	titleEmoji.appendChild(document.createTextNode(element.emoji ?? '⬜'));
	craftsTitle.appendChild(titleEmoji);
	craftsTitle.appendChild(document.createTextNode(` ${element.text} `));

	craftsContainer.innerHTML = '';
	const elementRecipes = recipes[element.text];
	if (elementRecipes === undefined) {
		const recipesEmpty = document.createElement('div');
		recipesEmpty.classList.add('modal-text');
		recipesEmpty.appendChild(document.createTextNode("I don't know how to craft this element!"));
		craftsContainer.appendChild(recipesEmpty);
	} else {
		const recipeKeys = Object.keys(recipes);
		for (const elementRecipe of elementRecipes) {
			const recipeDiv = document.createElement('div');
			recipeDiv.classList.add('recipe');

			const firstDiv = document.createElement('div');
			recipeKeys.includes(elementRecipe[0].text)
				? firstDiv.classList.add('item')
				: firstDiv.classList.add('display-item');
			const firstEmoji = document.createElement('span');
			recipeKeys.includes(elementRecipe[0].text)
				? firstEmoji.classList.add('item-emoji')
				: firstEmoji.classList.add('display-item-emoji');
			firstEmoji.appendChild(document.createTextNode(elementRecipe[0].emoji ?? '⬜'));
			firstDiv.appendChild(firstEmoji);
			firstDiv.appendChild(document.createTextNode(` ${elementRecipe[0].text} `));
			if (recipeKeys.includes(elementRecipe[0].text)) {
				firstDiv.addEventListener('click', () => {
					openCraftsForElement(elementRecipe[0]);
				});
			}
			recipeDiv.appendChild(firstDiv);

			recipeDiv.appendChild(document.createTextNode('+'));

			const secondDiv = document.createElement('div');
			recipeKeys.includes(elementRecipe[1].text)
				? secondDiv.classList.add('item')
				: secondDiv.classList.add('display-item');
			const secondEmoji = document.createElement('span');
			recipeKeys.includes(elementRecipe[1].text)
				? secondEmoji.classList.add('item-emoji')
				: secondEmoji.classList.add('display-item-emoji');
			secondEmoji.appendChild(document.createTextNode(elementRecipe[1].emoji ?? '⬜'));
			secondDiv.appendChild(secondEmoji);
			secondDiv.appendChild(document.createTextNode(` ${elementRecipe[1].text} `));
			if (recipeKeys.includes(elementRecipe[1].text)) {
				secondDiv.addEventListener('click', () => {
					openCraftsForElement(elementRecipe[1]);
				});
			}
			recipeDiv.appendChild(secondDiv);

			recipeDiv.appendChild(document.createTextNode('='));

			const resultDiv = document.createElement('div');
			resultDiv.classList.add('display-item');
			const resultEmoji = document.createElement('span');
			resultEmoji.classList.add('display-item-emoji');
			resultEmoji.appendChild(document.createTextNode(element.emoji ?? '⬜'));
			resultDiv.appendChild(resultEmoji);
			resultDiv.appendChild(document.createTextNode(` ${element.text} `));
			recipeDiv.appendChild(resultDiv);

			craftsContainer.appendChild(recipeDiv);
		}
	}
	craftsModal.showModal();
}

export async function resetCrafts() {
	recipes = {};
	await GM.setValue('recipes', '{}');
}

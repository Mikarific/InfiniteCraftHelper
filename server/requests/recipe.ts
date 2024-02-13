import { and, count, eq, or } from 'drizzle-orm';
import * as sqlite from '../handlers/db/database';

async function updateRecipe(
	first: {
		text: string;
		emoji: string;
	},
	second: {
		text: string;
		emoji: string;
	},
	result: {
		text: string;
		emoji: string;
	},
) {
	const ingredients =
		first.text.localeCompare(second.text, 'en') === -1
			? await sqlite.db
					.select()
					.from(sqlite.lineage)
					.where(or(eq(sqlite.lineage.result, first.text), eq(sqlite.lineage.result, second.text)))
			: await sqlite.db
					.select()
					.from(sqlite.lineage)
					.where(or(eq(sqlite.lineage.result, second.text), eq(sqlite.lineage.result, first.text)));
	if (first.text === second.text) ingredients.push(ingredients[0]);

	if (ingredients.length < 2) {
		return new Response(null, { status: 200 });
	}

	const recipeExists =
		(
			await sqlite.db
				.select({ count: count(sqlite.recipes) })
				.from(sqlite.recipes)
				.where(and(eq(sqlite.recipes.first, ingredients[0].result), eq(sqlite.recipes.second, ingredients[1].result)))
		)[0].count > 0;
	const recipeCount = (
		await sqlite.db
			.select({ count: count(sqlite.recipes) })
			.from(sqlite.recipes)
			.where(eq(sqlite.recipes.result, result.text))
	)[0].count;

	if (!recipeExists || recipeCount > 5) {
		await sqlite.db.insert(sqlite.recipes).values({
			result: result.text,
			emoji: result.emoji,
			first: ingredients[0].result,
			firstEmoji: ingredients[0].emoji,
			second: ingredients[1].result,
			secondEmoji: ingredients[1].emoji,
		});
	}

	let cycle = false;
	const visited: Map<string, boolean> = new Map();
	async function checkIfCycle(element: { first: string; second: string; result: string }) {
		if (visited.get(element.result) === true || cycle) {
			return;
		}

		if (visited.get(element.result) === false) {
			cycle = true;
			return;
		}

		if (visited.get(element.result) === undefined) visited.set(element.result, false);

		const cycleIngredients = await sqlite.db
			.select({
				result: sqlite.lineage.result,
				first: sqlite.lineage.first,
				second: sqlite.lineage.second,
			})
			.from(sqlite.lineage)
			.where(or(eq(sqlite.lineage.result, element.first), eq(sqlite.lineage.result, element.second)));

		for (const ingredient of cycleIngredients) {
			if (ingredient.first !== '' && ingredient.second !== '') {
				await checkIfCycle(ingredient);
			}
		}

		visited.set(element.result, true);
	}
	await checkIfCycle({ first: first.text, second: second.text, result: result.text });

	if (cycle) return new Response(null, { status: 200 });

	const existingRecipe = await sqlite.db.select().from(sqlite.lineage).where(eq(sqlite.lineage.result, result.text));

	const dependancyElements = await sqlite.db
		.select({
			id: sqlite.lineage.id,
			dependancies: sqlite.lineage.dependancies,
		})
		.from(sqlite.lineage)
		.where(or(eq(sqlite.lineage.id, ingredients[0].id), eq(sqlite.lineage.id, ingredients[1].id)));

	let dependancies: Set<number> = new Set([]);
	for (const dependancy of dependancyElements) {
		dependancies = new Set([...dependancies, ...dependancy.dependancies, dependancy.id]);
	}
	dependancies.delete(0);
	dependancies.delete(1);
	dependancies.delete(2);
	dependancies.delete(3);

	if (existingRecipe.length === 0) {
		await sqlite.db
			.insert(sqlite.lineage)
			.values({
				result: result.text,
				emoji: result.emoji,
				first: ingredients[0].result,
				firstEmoji: ingredients[0].emoji,
				second: ingredients[1].result,
				secondEmoji: ingredients[1].emoji,
				dependancies: dependancies,
			})
			.onConflictDoNothing();
	} else if (
		dependancies.size < existingRecipe[0].dependancies.size ||
		(dependancies.size === existingRecipe[0].dependancies.size && first.text === second.text)
	) {
		await sqlite.db
			.update(sqlite.lineage)
			.set({
				emoji: result.emoji,
				first: ingredients[0].result,
				firstEmoji: ingredients[0].emoji,
				second: ingredients[1].result,
				secondEmoji: ingredients[1].emoji,
				dependancies: dependancies,
			})
			.where(eq(sqlite.lineage.result, result.text));
		updateDepenants(result.text);
	}
}

async function updateDepenants(element: string) {
	const dependants = await sqlite.db
		.select()
		.from(sqlite.lineage)
		.where(or(eq(sqlite.lineage.first, element), eq(sqlite.lineage.second, element)));
	for (const dependant of dependants) {
		const dependancyElements = await sqlite.db
			.select({
				id: sqlite.lineage.id,
				dependancies: sqlite.lineage.dependancies,
			})
			.from(sqlite.lineage)
			.where(or(eq(sqlite.lineage.result, dependant.first), eq(sqlite.lineage.result, dependant.second)));

		let dependancies: Set<number> = new Set([]);
		for (const dependancy of dependancyElements) {
			dependancies = new Set([...dependancies, ...dependancy.dependancies, dependancy.id]);
		}

		await sqlite.db
			.update(sqlite.lineage)
			.set({
				dependancies: dependancies,
			})
			.where(eq(sqlite.lineage.id, dependant.id));
	}
}

export const pathname = '/recipe';
export async function post(req: Request) {
	const { first, second, result } = await req.json();
	if (typeof first.text !== 'string' || typeof first.emoji !== 'string' || first.text === '')
		return new Response(null, { status: 200 });
	if (typeof second.text !== 'string' || typeof second.emoji !== 'string' || second.text === '')
		return new Response(null, { status: 200 });
	if (
		typeof result.text !== 'string' ||
		typeof result.emoji !== 'string' ||
		result.text === '' ||
		result.text === 'Nothing'
	)
		return new Response(null, { status: 200 });
	if (first.text === result.text || second.text === result.text) return new Response(null, { status: 200 });

	updateRecipe(first, second, result);

	return new Response(null, { status: 200 });
}

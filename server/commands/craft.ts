import {
	AutocompleteInteraction,
	ButtonInteraction,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	SlashCommandStringOption,
} from 'discord.js';
import { eq, like } from 'drizzle-orm';

import * as sqlite from '../handlers/db/database';
import { matchSorter } from 'match-sorter';

export const data = new SlashCommandBuilder()
	.setName('craft')
	.setDescription('Find crafting recipes for any known element!')
	.addStringOption(
		new SlashCommandStringOption()
			.setName('element')
			.setDescription('The element you want the crafting recipes for.')
			.setRequired(true)
			.setAutocomplete(true),
	);
export const cooldown = 3;
export async function execute(interaction: ChatInputCommandInteraction) {
	const element = interaction.options.getString('element');
	if (element === null) {
		const embed = new EmbedBuilder()
			.setColor(0xffffff)
			.setTitle('❌ Oops!')
			.setDescription('Something went wrong while executing the command.');
		if (interaction.replied || interaction.deferred) {
			return await interaction.editReply({ embeds: [embed] });
		} else {
			return await interaction.reply({ embeds: [embed], ephemeral: true });
		}
	}
	if (element === 'Nothing') {
		const embed = new EmbedBuilder()
			.setColor(0xffffff)
			.setTitle('❓ Did you know?')
			.setDescription('The word "Nothing" is the only element that\'s truly impossible to craft!');
		if (interaction.replied || interaction.deferred) {
			return await interaction.editReply({ embeds: [embed] });
		} else {
			return await interaction.reply({ embeds: [embed] });
		}
	}
	await interaction.deferReply();
	const lineageElement = (
		await sqlite.db
			.select({
				result: sqlite.lineage.result,
				emoji: sqlite.lineage.emoji,
				first: sqlite.lineage.first,
				firstEmoji: sqlite.lineage.firstEmoji,
				second: sqlite.lineage.second,
				secondEmoji: sqlite.lineage.secondEmoji,
			})
			.from(sqlite.lineage)
			.where(eq(sqlite.lineage.result, element))
	)[0];
	const recipes = await sqlite.db
		.select({
			result: sqlite.recipes.result,
			emoji: sqlite.recipes.emoji,
			first: sqlite.recipes.first,
			firstEmoji: sqlite.recipes.firstEmoji,
			second: sqlite.recipes.second,
			secondEmoji: sqlite.recipes.secondEmoji,
		})
		.from(sqlite.recipes)
		.where(eq(sqlite.recipes.result, element))
		.limit(5);
	if (recipes.length === 0) {
		const embed = new EmbedBuilder()
			.setColor(0xffffff)
			.setTitle('🤔 Hmmm...')
			.setDescription("I don't have any records of that element!");
		if (interaction.replied || interaction.deferred) {
			return await interaction.editReply({ embeds: [embed] });
		} else {
			return await interaction.reply({ embeds: [embed] });
		}
	}

	let fields = [{ name: 'Recipes', value: '' }];
	for (const recipe of recipes) {
		fields[0].value =
			`${recipe.firstEmoji} ${recipe.first} + ${recipe.secondEmoji} ${recipe.second} = ${recipe.emoji} ${recipe.result}\n` +
			fields[0].value;
	}
	if (lineageElement !== undefined) {
		fields.unshift({
			name: 'Fastest Known Recipe',
			value: `${lineageElement.firstEmoji} ${lineageElement.first} + ${lineageElement.secondEmoji} ${lineageElement.second} = ${lineageElement.emoji} ${lineageElement.result}`,
		});
	}

	const embed = new EmbedBuilder()
		.setColor(0xffffff)
		.setTitle(`${recipes[0].emoji} ${recipes[0].result}`)
		.addFields(fields);
	if (interaction.replied || interaction.deferred) {
		return await interaction.editReply({ embeds: [embed] });
	} else {
		return await interaction.reply({ embeds: [embed] });
	}
}
export async function autocomplete(interaction: AutocompleteInteraction) {
	const query = interaction.options.getFocused();
	if (query === '') {
		interaction.respond(
			(
				await sqlite.db
					.select({
						result: sqlite.lineage.result,
						emoji: sqlite.lineage.emoji,
					})
					.from(sqlite.lineage)
					.limit(25)
			).map((option) => {
				return {
					name: `${option.emoji} ${option.result}`,
					value: option.result,
				};
			}),
		);
	} else {
		const exactMatch = await sqlite.db
			.select({
				result: sqlite.lineage.result,
				emoji: sqlite.lineage.emoji,
			})
			.from(sqlite.lineage)
			.where(eq(sqlite.lineage.result, query))
			.limit(1);
		const caseInsensitiveMatches = await sqlite.db
			.select({
				result: sqlite.lineage.result,
				emoji: sqlite.lineage.emoji,
			})
			.from(sqlite.lineage)
			.where(like(sqlite.lineage.result, `${query.replaceAll('%', '\\%').replaceAll('_', '\\_')}`))
			.limit(25);
		const inclusionMatches = await sqlite.db
			.select({
				result: sqlite.lineage.result,
				emoji: sqlite.lineage.emoji,
			})
			.from(sqlite.lineage)
			.where(like(sqlite.lineage.result, `%${query.replaceAll('%', '\\%').replaceAll('_', '\\_')}%`))
			.limit(25);
		const options = Array.from(
			new Set([...exactMatch, ...caseInsensitiveMatches, ...inclusionMatches].map((match) => JSON.stringify(match))),
		).map((match) => JSON.parse(match));
		interaction.respond(
			matchSorter(options, query, { keys: ['result'] })
				.map((option) => {
					return {
						name: `${option.emoji} ${option.result}`,
						value: option.result,
					};
				})
				.splice(0, 25),
		);
	}
}

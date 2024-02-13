import {
	AutocompleteInteraction,
	ButtonInteraction,
	ChatInputCommandInteraction,
	EmbedBuilder,
	SlashCommandBuilder,
	SlashCommandStringOption,
} from 'discord.js';
import { and, eq, gt, like, or } from 'drizzle-orm';
import { matchSorter } from 'match-sorter';

import * as sqlite from '../handlers/db/database';
import { createPaginationEmbed, updatePaginationEmbed } from '../handlers/pagination';

export const data = new SlashCommandBuilder()
	.setName('lineage')
	.setDescription('Find the lineage for any known element!')
	.addStringOption(
		new SlashCommandStringOption()
			.setName('element')
			.setDescription('The element you want the lineage for.')
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

	const databaseElement = (
		await sqlite.db
			.select({
				id: sqlite.lineage.id,
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
	if (databaseElement === undefined) {
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
	if (databaseElement.id <= 3) {
		const embed = new EmbedBuilder()
			.setColor(0xffffff)
			.setTitle("🤪 You thought you were clever, didn't you?")
			.setDescription("You can't craft a base element, you already have it!");
		if (interaction.replied || interaction.deferred) {
			return await interaction.editReply({ embeds: [embed] });
		} else {
			return await interaction.reply({ embeds: [embed] });
		}
	}

	let cycle = false;
	const visited: Map<string, boolean> = new Map();
	const tempDependancies: Set<string> = new Set([JSON.stringify(databaseElement)]);
	async function getDependencies(element: typeof databaseElement) {
		const ingredients = await sqlite.db
			.select({
				id: sqlite.lineage.id,
				result: sqlite.lineage.result,
				emoji: sqlite.lineage.emoji,
				first: sqlite.lineage.first,
				firstEmoji: sqlite.lineage.firstEmoji,
				second: sqlite.lineage.second,
				secondEmoji: sqlite.lineage.secondEmoji,
			})
			.from(sqlite.lineage)
			.where(or(eq(sqlite.lineage.result, element.first), eq(sqlite.lineage.result, element.second)));

		if (visited.get(element.result) === true || cycle) {
			return;
		}

		if (visited.get(element.result) === false) {
			cycle = true;
			return;
		}

		if (visited.get(element.result) === undefined) visited.set(element.result, false);

		for (const ingredient of ingredients) {
			if (ingredient.first !== '' && ingredient.second !== '') {
				tempDependancies.add(JSON.stringify(ingredient));
				await getDependencies(ingredient);
			}
		}

		visited.set(element.result, true);
	}
	await getDependencies(databaseElement);

	if (cycle) {
		const embed = new EmbedBuilder()
			.setColor(0xffffff)
			.setTitle(`${databaseElement.emoji} ${databaseElement.result}`)
			.setDescription(
				`${databaseElement.firstEmoji} ${databaseElement.first} + ${databaseElement.secondEmoji} ${databaseElement.second} = ${databaseElement.emoji} ${databaseElement.result}`,
			)
			.addFields([
				{ name: 'Lineage', value: "Couldn't get lineage! This element depends on something that depends on itself!" },
			]);
		if (interaction.replied || interaction.deferred) {
			return await interaction.editReply({ embeds: [embed] });
		} else {
			return await interaction.reply({ embeds: [embed] });
		}
	}

	const dependancies: {
		id: number;
		result: string;
		emoji: string;
		first: string;
		firstEmoji: string;
		second: string;
		secondEmoji: string;
	}[] = Array.from(tempDependancies).map((e) => JSON.parse(e));

	const craftedList = new Set([databaseElement]);
	async function getLineage(element: typeof databaseElement) {
		const ingredients = dependancies.filter((el) => el.result === element.first || el.result === element.second);

		for (const ingredient of ingredients) {
			if (ingredient.first !== '' && ingredient.second !== '') {
				craftedList.delete(ingredient);
				craftedList.add(ingredient);
				await getLineage(ingredient);
			}
		}
	}
	await getLineage(databaseElement);

	let i = 0;
	const embeds = [];
	for (const element of craftedList) {
		if (i % 20 === 0) {
			embeds.unshift({
				title: `${databaseElement.emoji} ${databaseElement.result}`,
				description: `${databaseElement.firstEmoji} ${databaseElement.first} + ${databaseElement.secondEmoji} ${databaseElement.second} = ${databaseElement.emoji} ${databaseElement.result}`,
				fields: [
					{
						name: 'Lineage',
						value: `${element.firstEmoji} ${element.first} + ${element.secondEmoji} ${element.second} = ${element.emoji} ${element.result}\n`,
					},
				],
				color: 0xffffff,
			});
		} else {
			embeds[0].fields[0].value =
				`${element.firstEmoji} ${element.first} + ${element.secondEmoji} ${element.second} = ${element.emoji} ${element.result}\n` +
				embeds[0].fields[0].value;
		}
		i++;
	}

	if (embeds.length === 1) {
		if (interaction.replied || interaction.deferred) {
			return await interaction.editReply({ embeds: embeds });
		} else {
			return await interaction.reply({ embeds: embeds });
		}
	} else {
		return await createPaginationEmbed(interaction, embeds, {
			startPage: embeds.length,
		});
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
					.where(gt(sqlite.lineage.id, 3))
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
			.where(and(gt(sqlite.lineage.id, 3), eq(sqlite.lineage.result, query)))
			.limit(1);
		const caseInsensitiveMatches = await sqlite.db
			.select({
				result: sqlite.lineage.result,
				emoji: sqlite.lineage.emoji,
			})
			.from(sqlite.lineage)
			.where(
				and(
					gt(sqlite.lineage.id, 3),
					like(sqlite.lineage.result, `${query.replaceAll('%', '\\%').replaceAll('_', '\\_')}`),
				),
			)
			.limit(25);
		const inclusionMatches = await sqlite.db
			.select({
				result: sqlite.lineage.result,
				emoji: sqlite.lineage.emoji,
			})
			.from(sqlite.lineage)
			.where(
				and(
					gt(sqlite.lineage.id, 3),
					like(sqlite.lineage.result, `%${query.replaceAll('%', '\\%').replaceAll('_', '\\_')}%`),
				),
			)
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
export async function button(interaction: ButtonInteraction) {
	await updatePaginationEmbed(interaction);
}

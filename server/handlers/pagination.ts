import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonInteraction,
	ButtonStyle,
	ChatInputCommandInteraction,
} from 'discord.js';

type PaginationEmbed = {
	interaction: ChatInputCommandInteraction;
	pages: any[];
	firstPage: string;
	lastPage: string;
	back: string;
	forth: string;
	page: number;
	maxMatches: number;
	timeout: number;
};

type PaginationOptions = {
	maxMatches?: number;
	timeout?: number;
	firstButton?: string;
	lastButton?: string;
	backButton?: string;
	forthButton?: string;
	startPage?: number;
};

const paginationEmbeds: Map<string, PaginationEmbed> = new Map();
export async function createPaginationEmbed(
	interaction: ChatInputCommandInteraction,
	pages: any[],
	options?: PaginationOptions,
) {
	const paginationEmbed: PaginationEmbed = {
		interaction: interaction,
		pages: pages,
		firstPage: options?.firstButton ?? '⏮',
		lastPage: options?.lastButton ?? '⏭',
		back: options?.backButton ?? '⬅',
		forth: options?.forthButton ?? '➡',
		page: options?.startPage ?? 1,
		maxMatches: options?.maxMatches ?? 50,
		timeout: options?.timeout ?? 600000,
	};

	if (paginationEmbed.pages.length < 2) {
		return Promise.reject(new Error('A Pagination Embed must contain at least 2 pages!'));
	}

	if (paginationEmbed.page < 1 || paginationEmbed.page > paginationEmbed.pages.length) {
		return Promise.reject(
			new Error(`Invalid start page! Must be between 1 (first) and ${paginationEmbed.pages.length} (last)`),
		);
	}

	if (paginationEmbed.maxMatches > 100) {
		return Promise.reject(new Error('Maximum amount of page changes exceeded! Must be under 100!'));
	}

	if (paginationEmbed.timeout > 900000) {
		return Promise.reject(
			new Error('Embed Timeout too high! Maximum pagination lifespan allowed is 15 minutes (900000 ms)!'),
		);
	}

	let embed = paginationEmbed.pages[paginationEmbed.page - 1];

	const pageText = `Page ${paginationEmbed.page} of ${paginationEmbed.pages.length}`;
	const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
		new ButtonBuilder().setCustomId('firstPage').setEmoji(paginationEmbed.firstPage).setStyle(ButtonStyle.Secondary),
		new ButtonBuilder().setCustomId('back').setEmoji(paginationEmbed.back).setStyle(ButtonStyle.Secondary),
		new ButtonBuilder().setCustomId('forth').setEmoji(paginationEmbed.forth).setStyle(ButtonStyle.Secondary),
		new ButtonBuilder().setCustomId('lastPage').setEmoji(paginationEmbed.lastPage).setStyle(ButtonStyle.Secondary),
	);
	if (interaction.replied || interaction.deferred) {
		await interaction.editReply({
			embeds: [
				Object.assign({}, embed, { footer: { text: embed.footer ? `${pageText} | ${embed.footer.text}` : pageText } }),
			],
			components: [row],
		});
	} else {
		await interaction.reply({
			embeds: [
				Object.assign({}, embed, { footer: { text: embed.footer ? `${pageText} | ${embed.footer.text}` : pageText } }),
			],
			components: [row],
		});
	}
	paginationEmbeds.set(paginationEmbed.interaction.id, paginationEmbed);

	setTimeout(async () => {
		const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
			new ButtonBuilder()
				.setCustomId('firstPage')
				.setEmoji(paginationEmbed.firstPage)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId('back')
				.setEmoji(paginationEmbed.back)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId('forth')
				.setEmoji(paginationEmbed.forth)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true),
			new ButtonBuilder()
				.setCustomId('lastPage')
				.setEmoji(paginationEmbed.lastPage)
				.setStyle(ButtonStyle.Secondary)
				.setDisabled(true),
		);
		if (interaction.replied || interaction.deferred) {
			await paginationEmbed.interaction.editReply({
				components: [row],
			});
		} else {
			await paginationEmbed.interaction.reply({
				components: [row],
			});
		}
	}, paginationEmbed.timeout);
}

async function update(paginationEmbed: PaginationEmbed, interaction: ButtonInteraction) {
	let embed = paginationEmbed.pages[paginationEmbed.page - 1];

	const pageText = `Page ${paginationEmbed.page} of ${paginationEmbed.pages.length}`;
	await interaction.update({
		embeds: [
			Object.assign({}, embed, { footer: { text: embed.footer ? `${pageText} | ${embed.footer.text}` : pageText } }),
		],
	});
}
export async function updatePaginationEmbed(interaction: ButtonInteraction) {
	const paginationEmbed = paginationEmbeds.get(interaction.message.interaction?.id ?? '');
	if (paginationEmbed === undefined) return await interaction.deferUpdate();
	if (paginationEmbed.interaction.user.id !== interaction.user.id) return await interaction.deferUpdate();
	if (interaction.customId === 'firstPage') {
		if (paginationEmbed.page > 1) {
			paginationEmbed.page = 1;
			return await update(paginationEmbed, interaction);
		}
	}
	if (interaction.customId === 'back') {
		if (paginationEmbed.page > 1) {
			paginationEmbed.page--;
			return await update(paginationEmbed, interaction);
		}
	}
	if (interaction.customId === 'forth') {
		if (paginationEmbed.page < paginationEmbed.pages.length) {
			paginationEmbed.page++;
			return await update(paginationEmbed, interaction);
		}
	}
	if (interaction.customId === 'lastPage') {
		if (paginationEmbed.page < paginationEmbed.pages.length) {
			paginationEmbed.page = paginationEmbed.pages.length;
			return await update(paginationEmbed, interaction);
		}
	}
	return await interaction.deferUpdate();
}

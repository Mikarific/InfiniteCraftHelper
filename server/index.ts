import config from '../config.toml';
import { z } from 'zod';

import { readdirSync } from 'node:fs';
import chalk from 'chalk';

import { verifyRequestOrigin } from './handlers/csrf';
import ratelimit from './handlers/ratelimit';
import { ActivityType, Client, Collection, EmbedBuilder, GatewayIntentBits } from 'discord.js';

declare module 'discord.js' {
	export interface Client {
		commands: Collection<unknown, any>;
		cooldowns: Collection<unknown, any>;
	}
}

const requestFileSchema = z.object({
	pathname: z.string().startsWith('/'),
	get: z.function().args(z.custom<Request>()).returns(z.custom<Response>()).optional(),
	post: z.function().args(z.custom<Request>()).returns(z.custom<Response>()).optional(),
});
type RequestFile = z.infer<typeof requestFileSchema>;

const requestFiles = readdirSync('./server/requests', { recursive: true }).filter((value) =>
	value.toString().endsWith('.ts'),
);

const requestsSchema = z.map(z.string().startsWith('/'), requestFileSchema);
type Requests = z.infer<typeof requestsSchema>;
let requests: Requests = new Map();

for (const file of requestFiles) {
	const request = await import(`./requests/${file}`);
	requests.set(request.pathname, request);
}

requests = requestsSchema.parse(requests);

Bun.serve({
	hostname: config.server.hostname,
	port: config.server.port,
	async fetch(req, server) {
		const url = new URL(req.url);

		const responseHeadersSchema = z.map(z.string(), z.string());
		type ResponseHeaders = z.infer<typeof responseHeadersSchema>;
		const headers: ResponseHeaders = new Map();
		headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

		if (requests.has(url.pathname)) {
			try {
				const requestFile: RequestFile = requestFileSchema.parse(requests.get(url.pathname));
				// Prevent CSRF
				const originHeader = req.headers.get('Origin') ?? req.headers.get('Referer');
				const requestIsCrossOrigin = !originHeader || !verifyRequestOrigin(originHeader, config.server.allowedOrigins);
				if (requestIsCrossOrigin) {
					const response = new Response(JSON.stringify({ error: 'CrossSiteRequest' }), {
						status: 403,
						headers: {
							'Content-Type': 'application/json',
						},
					});
					for (const [key, value] of headers) {
						response.headers.set(key, value);
					}
					return response;
				}

				// Check if ratelimited
				const ip = server.requestIP(req)?.address ?? '127.0.0.1';
				const ratelimited = ratelimit(url.pathname, ip);
				headers.set('X-RateLimit-Limit', ratelimited.limit.toString());
				headers.set('X-RateLimit-Remaining', ratelimited.remaining.toString());
				headers.set('X-RateLimit-Reset', ratelimited.reset.toString());
				if (ratelimited.remaining === -1) {
					const response = new Response(JSON.stringify({ error: 'TooManyRequests' }), {
						status: 429,
						headers: {
							'Content-Type': 'application/json',
						},
					});
					for (const [key, value] of headers) {
						response.headers.set(key, value);
					}
					return response;
				}

				// Get response
				const response =
					req.method === 'GET' && requestFile.get !== undefined
						? await requestFile.get(req, ip)
						: req.method === 'POST' && requestFile.post !== undefined
						? await requestFile.post(req, ip)
						: new Response(JSON.stringify({ error: 'RequestNotFound' }), {
								status: 404,
								headers: {
									'Content-Type': 'application/json',
								},
						  });
				for (const [key, value] of headers) {
					if (response.headers.get(key) === null) {
						response.headers.set(key, value);
					}
				}
				return response;
			} catch (error) {
				console.error(error);
				const response = new Response(JSON.stringify({ error: 'UnknownError' }), {
					status: 500,
					headers: {
						'Content-Type': 'application/json',
					},
				});
				for (const [key, value] of headers) {
					response.headers.set(key, value);
				}
				return response;
			}
		} else {
			const response = new Response(JSON.stringify({ error: 'RequestNotFound' }), {
				status: 404,
				headers: {
					'Content-Type': 'application/json',
				},
			});
			for (const [key, value] of headers) {
				response.headers.set(key, value);
			}
			return response;
		}
	},
	error(error) {
		console.error(error);
		return new Response(JSON.stringify({ error: 'UnknownError' }), {
			status: 500,
			headers: {
				'Content-Type': 'application/json',
			},
		});
	},
});
console.log(
	`${chalk.green.bold('[HTTP]')} ${config.server.name} listening on ${chalk.green(
		config.server.hostname,
	)}:${chalk.green(config.server.port)}.`,
);

const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });

bot.commands = new Collection();
bot.cooldowns = new Collection();

const commandFiles = readdirSync('./server/commands', { recursive: true }).filter((value) =>
	value.toString().endsWith('.ts'),
);

for (const file of commandFiles) {
	const command = await import(`./commands/${file}`);
	bot.commands.set(command.data.name, command);
}

bot.once('ready', async () => {
	console.log(`${chalk.blue.bold('[Discord]')} Logged in as ${chalk.green(bot.user?.tag)}.`);
	bot.user?.setActivity('Crafting elements...', { type: ActivityType.Custom });
});

bot.on('interactionCreate', async (interaction) => {
	if (interaction.isChatInputCommand()) {
		const command = bot.commands.get(interaction.commandName);
		if (!command) return;
		const { cooldowns } = bot;
		if (!cooldowns.has(command.data.name)) {
			cooldowns.set(command.data.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.data.name);
		const cooldownAmount = (command.cooldown || 1) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				const embed = new EmbedBuilder()
					.setColor(0xffffff)
					.setTitle('⏰ Wait!')
					.setDescription(
						`Please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`/${command.data.name}\` command.`,
					);
				await interaction.reply({ embeds: [embed] });
				return;
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		try {
			await command.execute(interaction);
		} catch (e) {
			console.error(e);
			const embed = new EmbedBuilder()
				.setColor(0xffffff)
				.setTitle('❌ Oops!')
				.setDescription('Something went wrong while executing the command.');
			if (interaction.replied || interaction.deferred) {
				await interaction.editReply({ embeds: [embed] });
			} else {
				await interaction.reply({ embeds: [embed], ephemeral: true });
			}
		}
	}
	if (interaction.isAutocomplete()) {
		const command = bot.commands.get(interaction.commandName);
		if (!command) return;
		try {
			await command.autocomplete(interaction);
		} catch (e) {
			console.error(e);
		}
	}
	if (interaction.isButton()) {
		const command = bot.commands.get(interaction.message.interaction?.commandName);
		if (!command) return;
		try {
			await command.button(interaction);
		} catch (e) {
			console.error(e);
		}
	}
});

bot.login(config.discord.token);

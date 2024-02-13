import config from '../../config.toml';

import { REST, Routes } from 'discord.js';
import { readdirSync } from 'node:fs';

const commands = [];

const commandFiles = readdirSync('./server/commands', { recursive: true }).filter((value) =>
	value.toString().endsWith('.ts'),
);
for (const file of commandFiles) {
	const command = await import(`../commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(config.discord.token);

rest
	.put(Routes.applicationCommands(config.discord.clientId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);

import config from '../config.toml';
import { z } from 'zod';

import { readdirSync } from 'node:fs';
import chalk from 'chalk';

import { verifyRequestOrigin } from './handlers/csrf';
import ratelimit from './handlers/ratelimit';

const requestFileSchema = z.object({
	pathname: z.string().startsWith('/'),
	get: z.function().args(z.custom<Request>()).returns(z.custom<Response>()).optional(),
	post: z.function().args(z.custom<Request>()).returns(z.custom<Response>()).optional(),
});
type RequestFile = z.infer<typeof requestFileSchema>;

const requestFiles = readdirSync('./server/requests', { recursive: true }).filter((value) => value.toString().endsWith('.ts'));

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
console.log(`${chalk.green.bold('[HTTP]')} ${config.server.name} listening on ${chalk.green(config.server.hostname)}:${chalk.green(config.server.port)}.`);

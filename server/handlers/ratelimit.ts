const ratelimits: Map<string, Map<string, number>> = new Map();
const timeouts: Map<string, Map<string, number>> = new Map();

export default function ratelimit(req: string, ip: string) {
	if (!ratelimits.has(req)) {
		ratelimits.set(req, new Map());
	}
	if (ratelimits.get(req)?.has(ip)) {
		const ipRatelimit = ratelimits.get(req)?.get(ip) ?? 0;
		if (ipRatelimit <= 10) {
			ratelimits.get(req)?.set(ip, ipRatelimit + 1);
		}
	} else {
		ratelimits.get(req)?.set(ip, 1);
		const timeout = 1000;
		if (!timeouts.has(req)) {
			timeouts.set(req, new Map());
		}
		if (!timeouts.get(req)?.has(ip)) {
			timeouts.get(req)?.set(ip, new Date().getTime() + timeout);
		}
		setTimeout(() => {
			if (ratelimits.get(req)?.has(ip)) {
				ratelimits.get(req)?.delete(ip);
			}
		}, timeout);
	}
	return {
		limit: 10,
		remaining: 10 - (ratelimits.get(req)?.get(ip) ?? 0),
		reset: timeouts.get(req)?.get(ip) ?? -1,
	};
}

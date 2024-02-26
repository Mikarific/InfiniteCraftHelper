import type { elements } from './index';

import { whiteFavicon } from './lib/assets';

export function init(elements: elements) {
	if (elements.favicon !== null) {
		const whiteFaviconLink = elements.favicon.cloneNode() as HTMLLinkElement;

		elements.favicon.media = '(prefers-color-scheme:light)';

		whiteFaviconLink.media = '(prefers-color-scheme:dark)';
		whiteFaviconLink.href = whiteFavicon.trim();

		elements.favicon.after(whiteFaviconLink);
	}
}

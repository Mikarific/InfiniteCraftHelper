import type { elements } from './index';

import { whiteFavicon } from './lib/assets';

export function init(elements: elements) {
    const originalFavicon = elements.head.querySelector('link[rel="icon"]') as HTMLLinkElement;
    const whiteFaviconLink = originalFavicon.cloneNode() as HTMLLinkElement;

    originalFavicon.media = '(prefers-color-scheme:light)'
    
    whiteFaviconLink.media  = '(prefers-color-scheme:dark)'
    whiteFaviconLink.href = whiteFavicon.trim();
    
    elements.head.appendChild(whiteFaviconLink)
}

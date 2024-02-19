import type { elements } from './index';

import { whitteFavicon } from './lib/assets';

export function init(elements: elements) {
    const originalFavicon = elements.head.querySelector('link[rel="icon"]') as HTMLLinkElement;
    const whiteFavicon = originalFavicon.cloneNode() as HTMLLinkElement;

    originalFavicon.media = '(prefers-color-scheme:light)'
    
    whiteFavicon.media  = '(prefers-color-scheme:dark)'
    whiteFavicon.href = whitteFavicon.trim();
    
    elements.head.appendChild(whiteFavicon)
}

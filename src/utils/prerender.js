export const triggerPrerender = (url) => {
    if (
        HTMLScriptElement.supports &&
        HTMLScriptElement.supports('speculationrules')
    ) {
        const specScript = document.createElement('script');
        specScript.type = 'speculationrules';
        const specRules = {
            prerender: [
                {
                    source: 'list',
                    urls: [url],
                },
            ],
            prefetch: [
                {
                    source: 'list',
                    urls: [url],
                },
            ],
        };
        specScript.textContent = JSON.stringify(specRules);
        document.head.appendChild(specScript);
    }
};

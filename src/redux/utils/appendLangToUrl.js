/**
 * Appends lang from URL (?lang=xx) or localStorage to the given request URL for GET requests.
 * Only used when role is SuperAdmin (see withLangForGetIfSuperAdmin).
 * Uses localStorage as fallback so the first request after login has lang (avoids duplicate calls).
 */
export const appendLangToUrl = (url) => {
    if (typeof window === 'undefined') return url;
    const urlLang = new URLSearchParams(window.location.search).get('lang');
    const storedLang = typeof localStorage !== 'undefined' ? localStorage.getItem('lang') : null;
    const lang = urlLang || storedLang || 'en';
    if (!lang) return url;
    try {
        const [path, existingQuery] = url.split('?');
        const params = new URLSearchParams(existingQuery || '');
        if (params.has('lang')) return url;
        params.set('lang', lang);
        return `${path}?${params.toString()}`;
    } catch {
        return url;
    }
};

const withLangForGet = (args) => {
    const isGet = typeof args === 'string' || !args || (typeof args === 'object' && (!args.method || args.method === 'GET'));
    if (!isGet) return args;
    const url = typeof args === 'string' ? args : args?.url;
    if (!url) return args;
    const urlWithLang = appendLangToUrl(url);
    return typeof args === 'string' ? urlWithLang : { ...args, url: urlWithLang };
};

/**
 * Appends lang from URL to GET request args only when role is SuperAdmin.
 * Use this in API slice baseQueryWithAuth so non-SuperAdmin never send lang.
 */
export const withLangForGetIfSuperAdmin = (args, api) => {
    const role = api?.getState()?.auth?.role;
    if (role !== 'SuperAdmin') return args;
    return withLangForGet(args);
};

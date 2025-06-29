export const encode = (uri: string) => encodeURIComponent(uri.replace(/\s/g, '-'));

export const decode = (uri: string) => decodeURIComponent(uri.replace(/-/g, ' '));

export const getItem = (key: string, fallback?: () => string) => {
  let value = localStorage.getItem(key);

  if (!value && typeof fallback === 'function') {
    value = fallback();
    localStorage.setItem(key, value);
  }

  return value;
};

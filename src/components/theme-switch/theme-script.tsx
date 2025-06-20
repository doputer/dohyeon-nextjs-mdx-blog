export type Theme = 'light' | 'dark';
type Listener = (theme: Theme) => void;

declare global {
  interface Window {
    __theme: Theme;
    __setPreferredTheme: (theme: Theme) => void;
    __addThemeListener: (callback: Listener) => void;
    __removeThemeListener: (callback: Listener) => void;
  }
}

const script = function () {
  function setTheme(newTheme: Theme) {
    document.documentElement.dataset.theme = newTheme;

    window.__theme = newTheme;
    themeListeners.forEach((listener) => listener(newTheme));
  }

  let preferredTheme: Theme;
  let themeListeners: Listener[] = [];

  try {
    preferredTheme = localStorage.getItem('theme') as Theme;
  } catch (error) {
    console.error(error);
    return;
  }

  window.__addThemeListener = (listener) => {
    themeListeners.push(listener);
  };

  window.__removeThemeListener = (listener) => {
    themeListeners = themeListeners.filter((l) => l !== listener);
  };

  window.__setPreferredTheme = function (newTheme) {
    setTheme(newTheme);

    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error(error);
    }
  };

  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  darkQuery.addEventListener('change', function (e) {
    window.__setPreferredTheme(e.matches ? 'dark' : 'light');
  });

  setTheme(preferredTheme || (darkQuery.matches ? 'dark' : 'light'));
};

const ThemeScript = () => {
  return <script dangerouslySetInnerHTML={{ __html: `(${script})();` }}></script>;
};

export default ThemeScript;

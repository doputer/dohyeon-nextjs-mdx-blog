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
  const THEME_COLOR: Record<Theme, string> = {
    dark: 'oklch(22.5% 0.0074 248deg)',
    light: 'oklch(100% 0 0)',
  };

  let themeListeners: Listener[] = [];

  function setTheme(newTheme: Theme) {
    document.documentElement.dataset.theme = newTheme;

    const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    if (meta) meta.content = THEME_COLOR[newTheme];

    window.__theme = newTheme;
    themeListeners.forEach((listener) => listener(newTheme));
  }

  let storedTheme: Theme | null = null;

  try {
    const stored = localStorage.getItem('theme');

    if (stored === 'dark' || stored === 'light') storedTheme = stored;
  } catch (error) {
    console.error(error);
  }

  window.__addThemeListener = (listener) => {
    themeListeners.push(listener);
  };

  window.__removeThemeListener = (listener) => {
    themeListeners = themeListeners.filter((l) => l !== listener);
  };

  window.__setPreferredTheme = function (newTheme) {
    storedTheme = newTheme;
    setTheme(newTheme);

    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.error(error);
    }
  };

  const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');

  darkQuery.addEventListener('change', function (event) {
    if (storedTheme) return;

    setTheme(event.matches ? 'dark' : 'light');
  });

  setTheme(storedTheme ?? (darkQuery.matches ? 'dark' : 'light'));
};

const ThemeScript = () => {
  return (
    <>
      <meta name="theme-color" />
      <script dangerouslySetInnerHTML={{ __html: `(${script})();` }}></script>
    </>
  );
};

export default ThemeScript;

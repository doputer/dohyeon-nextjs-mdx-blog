import { AtSymbolIcon } from '@heroicons/react/24/solid';

import GitHub from '@/components/footer/github';
import config from '@/configs/config.json';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <hr className="border-line" />
      <footer className="flex items-center justify-between text-sm text-muted">
        <p>
          © {year}. {config.name}.
        </p>
        <ul className="flex items-center gap-2">
          <li>
            <a
              href={`mailto:${config.social.email}`}
              aria-label="이메일"
              className="flex size-8 items-center justify-center transition-colors duration-200 ease-out hover:text-main"
            >
              <AtSymbolIcon className="size-4" />
            </a>
          </li>
          <li>
            <a
              href={config.social.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex size-8 items-center justify-center transition-colors duration-200 ease-out hover:text-main"
            >
              <GitHub className="size-4" />
            </a>
          </li>
        </ul>
      </footer>
    </>
  );
};

export default Footer;

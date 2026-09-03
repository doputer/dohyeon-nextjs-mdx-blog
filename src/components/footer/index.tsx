import config from '@/configs/config.json';

const Footer = () => {
  return (
    <footer className="flex items-center justify-center gap-4 text-sm text-muted">
      <a
        href={`mailto:${config.social.email}`}
        className="transition-colors duration-200 ease-out hover:text-main"
      >
        Email
      </a>
      <a
        href={config.social.github}
        target="_blank"
        rel="noreferrer"
        className="transition-colors duration-200 ease-out hover:text-main"
      >
        GitHub
      </a>
    </footer>
  );
};

export default Footer;

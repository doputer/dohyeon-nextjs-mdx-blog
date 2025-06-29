import config from '@/configs/config.json';

const Footer = () => {
  return (
    <footer className="flex justify-center border-t border-line pt-8 text-sm text-subtle">
      ⓒ 2025.{' '}
      <a href={config.social.github} target="_blank" aria-label="link">
        김도현
      </a>
      . All Rights Reserved.
    </footer>
  );
};

export default Footer;

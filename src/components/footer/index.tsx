import config from '@/configs/config.json';

const Footer = () => {
  return (
    <footer className="border-line text-subtle flex justify-center border-t pt-8 text-sm">
      ⓒ 2025.{' '}
      <a href={config.social.github} target="_blank" aria-label="link">
        김도현
      </a>
      . All Rights Reserved.
    </footer>
  );
};

export default Footer;

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <hr className="border-line" />
      <footer className="flex justify-center text-xs text-muted">
        <p>© {year}. 김도현. All Rights Reserved.</p>
      </footer>
    </>
  );
};

export default Footer;

export default location => {
  const [language] = location.pathname.split('/').filter(Boolean);

  return { language };
};

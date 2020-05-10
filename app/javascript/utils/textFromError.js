export default (error, t) => {
  if (!error.response) {
    return t('Oops… something wrong happened');
  }

  switch (error.response.status) {
    case 422:
      return t("Can't save your report");
    default:
      return t('Oops… something wrong happened');
  }
};

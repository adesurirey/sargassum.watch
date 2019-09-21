export default (error, t) => {
  switch (error.response.status) {
    case 422:
      return t("Can't save your report. Did you disable cookies?");
    default:
      return t('Oops… something wrong happened');
  }
};

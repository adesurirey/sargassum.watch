export default (error, t) => {
  switch (error.response.status) {
    case 422:
      return t("Can't save your report");
    default:
      return t('Oops… something wrong happened');
  }
};

const arrayToObject = (array, transform) =>
  array.reduce((obj, item) => {
    transform(obj, item);
    return obj;
  }, {});

export { arrayToObject };

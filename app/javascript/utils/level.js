import { arrayToObject } from '../utils/root';

const { levels } = gon;

const getLevelStyles = (theme, prop) =>
  arrayToObject(levels, (obj, level) => {
    obj[level.label] = {
      [prop]: theme.palette.level[level.label].main,
    };
  });

export { getLevelStyles };

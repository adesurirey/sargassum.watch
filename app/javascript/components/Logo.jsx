import React from 'react';

import srcset from '../utils/srcset';
import Src from '../images/sargassum.watch-nude.png';
import Src2x from '../images/sargassum.watch-nude@2x.png';
import Src3x from '../images/sargassum.watch-nude@3x.png';

const source = [Src, Src2x, Src3x];

const Logo = props => (
  <img srcSet={srcset(source)} height={27} alt="logo" {...props} />
);

export default Logo;

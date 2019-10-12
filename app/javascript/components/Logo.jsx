import React from 'react';

import srcset from '../utils/srcset';
import Src from '../images/sargassum.watch-logo.png';
import Src2x from '../images/sargassum.watch-logo@2x.png';
import Src3x from '../images/sargassum.watch-logo@3x.png';

const source = [Src, Src2x, Src3x];

const Logo = props => (
  <img srcSet={srcset(source)} height={27} alt="logo" {...props} />
);

export default Logo;

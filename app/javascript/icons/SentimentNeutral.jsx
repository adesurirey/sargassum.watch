import React from 'react';
import { SvgIcon } from '@material-ui/core';

const SentimentNeutral = props => (
  <SvgIcon width={24} height={24} {...props}>
    <g transform="translate(2 2)" fillRule="nonzero">
      <path d="M7 12h6a.773.773 0 010 1.5H7A.773.773 0 017 12z" />
      <circle cx={13.5} cy={7.5} r={1.5} />
      <circle cx={6.5} cy={7.5} r={1.5} />
      <path d="M9.99 0C4.47 0 0 4.48 0 10s4.47 10 9.99 10C15.52 20 20 15.52 20 10S15.52 0 9.99 0zM10 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" />
    </g>
  </SvgIcon>
);

export default SentimentNeutral;

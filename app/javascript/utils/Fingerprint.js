// Note: You should not run fingerprinting directly on or after page load.
// Rather, delay it for a few milliseconds with setTimeout or requestIdleCallback
// to ensure consistent fingerprints.
//
// https://github.com/Valve/fingerprintjs2#usage

import Fingerprint2 from 'fingerprintjs2';

const options = {};

export default class {
  constructor() {
    // Result should stay undefined until computed so it will
    // be ignored form headers or body objects sent to the api.
    this.result = undefined;

    this._init();
  }

  _init() {
    if (window.requestIdleCallback) {
      requestIdleCallback(this._compute);
    } else {
      setTimeout(this._compute, 500);
    }
  }

  _compute = () => {
    Fingerprint2.get(options, components => {
      const values = components.map(component => component.value);
      this.result = Fingerprint2.x64hash128(values.join(''), 31);
    });
  };
}

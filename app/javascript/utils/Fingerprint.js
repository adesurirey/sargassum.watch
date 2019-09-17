// Note: You should not run fingerprinting directly on or after page load.
// Rather, delay it for a few milliseconds with setTimeout or requestIdleCallback
// to ensure consistent fingerprints.
//
// https://github.com/Valve/fingerprintjs2#usage

import Fingerprint2 from 'fingerprintjs2';

export default class {
  constructor() {
    this.hash = null;

    this._init();
  }

  _setHash = () =>
    Fingerprint2.getV18(result => {
      this.hash = result;
    });

  _init() {
    if (window.requestIdleCallback) {
      requestIdleCallback(this._setHash);
    } else {
      setTimeout(this._setHash, 500);
    }
  }
}

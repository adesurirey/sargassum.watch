import axios from 'axios';

import csrfToken from './csrfToken';
import Fingerprint from '../utils/Fingerprint';

const fingerprint = new Fingerprint();
const accept = 'application/json';

export default class {
  constructor() {
    this._setDefaultHeaders();
  }

  _setDefaultHeaders() {
    axios.default.headers = { accept };
  }

  _postHeaders() {
    return {
      headers: {
        'X-CSRF-Token': csrfToken(),
        'X-Fingerprint': fingerprint.hash,
      },
    };
  }

  getAll() {
    return axios.get('/reports');
  }

  create(report) {
    return axios.post('/reports', { report }, this._postHeaders());
  }
}
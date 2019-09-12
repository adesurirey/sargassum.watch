import axios from 'axios';

const accept = 'application/json';

export default class {
  constructor() {
    this._setDefaultHeaders();
  }

  _setDefaultHeaders() {
    axios.default.headers = { accept };
  }

  getAll() {
    return axios.get('/reports');
  }
}

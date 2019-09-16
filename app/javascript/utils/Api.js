import axios from 'axios';

const accept = 'application/json';

const getToken = () => document.querySelector('meta[name=csrf-token]').content;
const csrfHeader = () => ({ headers: { 'X-CSRF-Token': getToken() } });

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

  create(report) {
    return axios.post('/reports', { report }, csrfHeader());
  }
}

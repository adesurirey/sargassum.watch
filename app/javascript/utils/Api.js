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

  _auth() {
    return {
      headers: {
        'X-CSRF-Token': csrfToken(),
        'X-Fingerprint': fingerprint.hash,
      },
    };
  }

  getReports() {
    return axios.get('/reports');
  }

  createReport(report) {
    return axios.post('/reports', { report }, this._auth());
  }

  updateReport(report) {
    const data = new FormData();
    Object.entries(report).forEach(([key, value]) => {
      data.append(key, value);
    });

    return axios.patch(`/reports/${report.id}`, data, this._auth());
  }

  createSetting(setting) {
    return axios.post('/settings', { setting }, this._auth());
  }
}

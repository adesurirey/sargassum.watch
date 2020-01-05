import axios from 'axios';

import csrfToken from './csrfToken';
import Fingerprint from '../utils/Fingerprint';

// Fingerprint can take up to 500ms to generate,
// you should start its computation as soon as possible.
const fingerprint = new Fingerprint();

export const API_BASE = '/api/v1';

export default class {
  constructor() {
    this._setDefaultHeaders();
  }

  _setDefaultHeaders() {
    axios.default.headers = {
      accept: 'application/json',
    };
  }

  _auth() {
    const headers = {
      'X-CSRF-Token': csrfToken(),
      'X-Fingerprint': fingerprint.result,
    };

    return { headers };
  }

  getReports() {
    return axios.get(`${API_BASE}/reports`);
  }

  createReport(report) {
    return axios.post(`${API_BASE}/reports`, { report }, this._auth());
  }

  updateReport(report) {
    const data = new FormData();
    Object.entries(report).forEach(([key, value]) => {
      data.append(key, value);
    });

    return axios.patch(`${API_BASE}/reports/${report.id}`, data, this._auth());
  }

  createSetting(setting) {
    return axios.post(`${API_BASE}/settings`, { setting }, this._auth());
  }
}

import axios from 'axios';

import Fingerprint from './Fingerprint';
import getCSRFToken from '../utils/getCSRFToken';

// Fingerprint can take up to 500ms to generate,
// you should start its computation as soon as possible.
const fingerprint = new Fingerprint();

export const API_BASE = '/api/v1';

const api = axios.create({
  baseURL: API_BASE,
});

api.defaults.headers = {
  accept: 'application/json',
};

export default class {
  _auth() {
    const headers = {
      'X-CSRF-Token': getCSRFToken(),
      'X-Fingerprint': fingerprint.result,
    };

    return { headers };
  }

  getReports() {
    return api.get('/reports');
  }

  createReport(report) {
    return api.post('/reports', { report }, this._auth());
  }

  updateReport(report) {
    const data = new FormData();
    data.append('photo', report.photo);

    return api.patch(`/reports/${report.id}`, data, this._auth());
  }

  createSetting(setting) {
    return api.post('/settings', { setting }, this._auth());
  }
}

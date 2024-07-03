import cons from './cons';

function getSecret(key) {
  return localStorage.getItem(key);
}

const isAuthenticated = () =>
  'syt_Y2x3cnFqdDJvMDNkbHY5d2lxcTZrbGFveg_MlhmFvzAeghOHZAldIuX_3qPSTj' !== null;

const secret = {
  accessToken: 'syt_Y2x3cnFqdDJvMDNkbHY5d2lxcTZrbGFveg_MlhmFvzAeghOHZAldIuX_3qPSTj',
  deviceId: 'WPIVYKNWTO',
  userId: '@clwrqjt2o03dlv9wiqq6klaoz:staging-matrix.momentify.xyz',
  baseUrl: 'https://staging-matrix.momentify.xyz',
};

export { isAuthenticated, secret, getSecret };

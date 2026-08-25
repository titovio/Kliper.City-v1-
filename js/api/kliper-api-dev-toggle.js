(function () {
  'use strict';

  var params = new URLSearchParams(window.location.search || '');
  var apiMode = params.get('kliperApi');
  var apiBase = params.get('kliperApiBase');

  if (apiMode !== '1' || !apiBase) return;

  window.KLIPER_API_CONFIG = Object.assign({}, window.KLIPER_API_CONFIG || {}, {
    enabled: true,
    baseUrl: apiBase,
    timeoutMs: Number(params.get('kliperApiTimeout') || 3500),
    fallbackMode: 'mock',
    debug: params.get('kliperApiDebug') === '1'
  });

  window.KLIPER_FEATURES = Object.assign({}, window.KLIPER_FEATURES || {}, {
    apiAdapter: true,
    companyCabinetApi: true,
    pricingApi: true,
    migrationPreview: true
  });
})();

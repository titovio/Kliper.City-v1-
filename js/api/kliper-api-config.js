(function () {
  'use strict';

  var previousConfig = window.KLIPER_API_CONFIG || {};
  var previousFeatures = window.KLIPER_FEATURES || {};

  window.KLIPER_API_CONFIG = {
    enabled: previousConfig.enabled === true,
    baseUrl: previousConfig.baseUrl || '',
    timeoutMs: Number(previousConfig.timeoutMs || 3500),
    fallbackMode: previousConfig.fallbackMode || 'mock',
    debug: previousConfig.debug === true
  };

  window.KLIPER_FEATURES = Object.assign({
    apiAdapter: false,
    companyCabinetApi: false,
    pricingApi: false,
    migrationPreview: false
  }, previousFeatures);
})();

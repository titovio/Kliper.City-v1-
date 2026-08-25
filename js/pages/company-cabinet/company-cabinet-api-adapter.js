(function () {
  'use strict';

  function getCabinetSnapshot(routeValue) {
    var mock = window.KLIPER_API_MOCK;
    if (!mock || typeof mock.getCompanyCabinet !== 'function') {
      return {
        source: 'mock',
        data: null
      };
    }
    var result = mock.getCompanyCabinet(routeValue);
    return {
      ok: result.ok,
      source: result.source || 'mock',
      warning: result.warning || '',
      data: result.data || null,
      error: result.error || null
    };
  }

  function loadCabinet(routeValue) {
    var api = window.KLIPER_API;
    if (!api || typeof api.getCompanyCabinet !== 'function') {
      return Promise.resolve(getCabinetSnapshot(routeValue));
    }
    return api.getCompanyCabinet(routeValue).then(function (result) {
      return {
        ok: !!(result && result.ok),
        source: result && result.source || 'api',
        warning: result && result.warning || '',
        data: result && result.data || null,
        error: result && result.error || null
      };
    });
  }

  window.KLIPER_COMPANY_CABINET_ADAPTER = {
    getCabinetSnapshot: getCabinetSnapshot,
    loadCabinet: loadCabinet
  };
})();

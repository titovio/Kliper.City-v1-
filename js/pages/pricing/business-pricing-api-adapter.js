(function () {
  'use strict';

  function getPricingSnapshot() {
    var mock = window.KLIPER_API_MOCK;
    if (!mock || typeof mock.getBillingPlans !== 'function') {
      return {
        source: 'mock',
        pricing: window.KLIPER_COMPANY_PRICING || { plans: [], notes: [] }
      };
    }
    var result = mock.getBillingPlans();
    return {
      source: result.source || 'mock',
      warning: result.warning || '',
      pricing: result.data || window.KLIPER_COMPANY_PRICING || { plans: [], notes: [] }
    };
  }

  function loadPricing() {
    var api = window.KLIPER_API;
    if (!api || typeof api.getBillingPlans !== 'function') {
      return Promise.resolve(getPricingSnapshot());
    }
    return api.getBillingPlans().then(function (result) {
      if (result && result.ok) {
        return {
          source: result.source || 'api',
          warning: result.warning || '',
          pricing: result.data || {}
        };
      }
      return {
        source: result && result.source || 'api',
        error: result && result.error || { code: 'api_error', message: 'Ошибка API' },
        pricing: getPricingSnapshot().pricing
      };
    });
  }

  window.KLIPER_BUSINESS_PRICING_ADAPTER = {
    getPricingSnapshot: getPricingSnapshot,
    loadPricing: loadPricing
  };
})();

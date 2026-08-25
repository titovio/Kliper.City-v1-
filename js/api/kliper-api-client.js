(function () {
  'use strict';

  function config() {
    return window.KLIPER_API_CONFIG || {};
  }

  function features() {
    return window.KLIPER_FEATURES || {};
  }

  function isEnabled() {
    var cfg = config();
    var flags = features();
    return cfg.enabled === true && flags.apiAdapter === true && !!cfg.baseUrl;
  }

  function normalizePath(path) {
    return String(path || '').replace(/^\/+/, '');
  }

  function fallback(method, args, warning) {
    var mock = window.KLIPER_API_MOCK || {};
    if (typeof mock[method] === 'function') {
      var result = mock[method].apply(mock, args || []);
      if (warning && result && result.ok && !result.warning) result.warning = warning;
      return Promise.resolve(result);
    }
    return Promise.resolve({
      ok: false,
      source: 'mock',
      error: {
        code: 'mock_unavailable',
        message: 'Mock fallback недоступен'
      }
    });
  }

  function request(path, options) {
    var cfg = config();
    if (!isEnabled()) {
      return Promise.resolve({
        ok: false,
        source: 'local',
        error: {
          code: 'api_disabled',
          message: 'API adapter выключен'
        }
      });
    }

    if (!window.fetch) {
      return Promise.resolve({
        ok: false,
        source: 'api',
        error: {
          code: 'fetch_unavailable',
          message: 'Fetch недоступен'
        }
      });
    }

    var controller = window.AbortController ? new AbortController() : null;
    var timeout = window.setTimeout(function () {
      if (controller) controller.abort();
    }, Number(cfg.timeoutMs || 3500));

    var url = String(cfg.baseUrl || '').replace(/\/+$/, '') + '/' + normalizePath(path);
    var fetchOptions = Object.assign({
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' }
    }, options || {});
    if (controller) fetchOptions.signal = controller.signal;

    return window.fetch(url, fetchOptions)
      .then(function (response) {
        return response.json().catch(function () {
          return {
            ok: false,
            error: {
              code: 'invalid_json',
              message: 'Некорректный JSON-ответ'
            }
          };
        }).then(function (payload) {
          if (payload && payload.ok === false) {
            return {
              ok: false,
              source: 'api',
              status: response.status,
              error: payload.error || {
                code: 'api_error',
                message: 'Ошибка API'
              }
            };
          }
          return {
            ok: response.ok,
            source: 'api',
            status: response.status,
            data: payload && payload.data !== undefined ? payload.data : payload
          };
        });
      })
      .catch(function (error) {
        return {
          ok: false,
          source: 'api',
          error: {
            code: error && error.name === 'AbortError' ? 'request_timeout' : 'backend_unavailable',
            message: 'Backend недоступен'
          }
        };
      })
      .finally(function () {
        window.clearTimeout(timeout);
      });
  }

  function canFallback(result) {
    var code = result && result.error && result.error.code;
    return code !== 'unauthorized' &&
      code !== 'company_access_denied' &&
      code !== 'company_not_found';
  }

  function withFallback(requestPromise, method, args) {
    if (!isEnabled()) return fallback(method, args);

    return requestPromise.then(function (result) {
      if (result && result.ok) return result;
      if (canFallback(result)) return fallback(method, args, result && result.error && result.error.code);
      return result;
    });
  }

  function getMe() {
    return withFallback(request('me'), 'getMe');
  }

  function getBillingPlans() {
    return withFallback(request('billing/plans'), 'getBillingPlans');
  }

  function getCompanySubscription(companyId) {
    return withFallback(
      request('companies/' + encodeURIComponent(companyId || '') + '/subscription'),
      'getCompanySubscription',
      [companyId]
    );
  }

  function getCompanyCabinet(companyId) {
    return withFallback(
      request('companies/' + encodeURIComponent(companyId || '') + '/cabinet'),
      'getCompanyCabinet',
      [companyId]
    );
  }

  function getMigrationPreview() {
    return withFallback(request('me/migration-preview'), 'getMigrationPreview');
  }

  window.KLIPER_API = {
    isEnabled: isEnabled,
    request: request,
    getMe: getMe,
    getBillingPlans: getBillingPlans,
    getCompanySubscription: getCompanySubscription,
    getCompanyCabinet: getCompanyCabinet,
    getMigrationPreview: getMigrationPreview
  };
})();

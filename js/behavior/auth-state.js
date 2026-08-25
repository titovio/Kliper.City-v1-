(function () {
  'use strict';

  var state = window.KLIPER_AUTH_STATE || {
    status: 'anonymous',
    user: null,
    companies: [],
    activeCompanyId: null,
    source: 'local'
  };

  function setState(nextState) {
    state = Object.assign({}, state, nextState || {});
    window.KLIPER_AUTH_STATE = state;
    try {
      window.dispatchEvent(new CustomEvent('kliper-auth-state-change', { detail: state }));
    } catch (error) {}
    return state;
  }

  function load() {
    var api = window.KLIPER_API;
    var features = window.KLIPER_FEATURES || {};
    if (!api || !features.apiAdapter || !api.isEnabled()) {
      return Promise.resolve(setState({ status: 'anonymous', source: 'local' }));
    }

    setState({ status: 'loading' });
    return api.getMe().then(function (result) {
      if (result && result.ok) {
        return setState({
          status: 'authenticated',
          user: result.data.user || null,
          companies: result.data.companies || [],
          source: result.source || 'api'
        });
      }
      if (result && result.error && result.error.code === 'unauthorized') {
        return setState({ status: 'anonymous', source: 'api' });
      }
      return setState({ status: 'error', source: result && result.source || 'api' });
    });
  }

  window.KLIPER_AUTH = {
    getState: function () { return state; },
    setState: setState,
    load: load
  };

  window.KLIPER_AUTH_STATE = state;
})();

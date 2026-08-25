(function () {
  'use strict';

  function ok(data, warning) {
    var result = {
      ok: true,
      source: 'mock',
      data: data || {}
    };
    if (warning) result.warning = warning;
    return result;
  }

  function normalize(value) {
    return String(value || '').trim().toLowerCase();
  }

  function readJsonStorage(key, fallback) {
    try {
      var raw = window.localStorage && window.localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function toArray(value) {
    return Array.isArray(value) ? value : [];
  }

  function getPricing() {
    return window.KLIPER_COMPANY_PRICING || { plans: [], notes: [] };
  }

  function getPlanById(planId) {
    var pricing = getPricing();
    var plans = toArray(pricing.plans);
    return plans.find(function (plan) { return plan.id === planId; }) || plans[0] || null;
  }

  function getCompanyByRoute(routeValue) {
    var developers = toArray(window.KLIPER_DEVELOPERS);
    var route = normalize(routeValue);
    return developers.find(function (developer) {
      return normalize(developer.slug) === route || normalize(developer.name) === route;
    }) || developers[0] || null;
  }

  function getCompanyConfig(developer) {
    var source = window.KLIPER_COMPANY_CABINET || {};
    var defaults = source.defaults || {};
    var company = developer && source.companies ? source.companies[developer.slug] || {} : {};
    return {
      companyId: company.companyId || (developer && developer.slug) || '',
      companyName: company.companyName || (developer && developer.name) || '',
      currentRole: company.currentRole || defaults.currentRole || 'company_owner',
      profileStatusLabel: company.profileStatusLabel || defaults.profileStatusLabel || 'Профиль опубликован',
      healthLabel: company.healthLabel || defaults.healthLabel || 'Проверки перед публикацией',
      currentPlan: company.currentPlan || defaults.currentPlan || '',
      lead: company.lead || 'Рабочее пространство компании в Kliper.City.',
      documents: company.documents || defaults.documents || [],
      posts: company.posts || defaults.posts || [],
      stories: company.stories || defaults.stories || [],
      subscriberSegments: company.subscriberSegments || defaults.subscriberSegments || [],
      reviews: company.reviews || defaults.reviews || [],
      dialogs: company.dialogs || defaults.dialogs || [],
      offers: company.offers || defaults.offers || []
    };
  }

  function getObjectsForCompany(developer) {
    if (!developer) return [];
    return toArray(window.KLIPER_BUILDINGS)
      .filter(function (object) { return object.developer === developer.name; })
      .slice(0, 8);
  }

  function getBillingPlans() {
    var pricing = getPricing();
    var plans = toArray(pricing.plans).map(function (plan) {
      return {
        id: plan.id,
        name: plan.name,
        price: plan.price,
        period: plan.period || 'мес',
        cardsLimit: plan.cardsLimit,
        label: plan.label,
        button: plan.button,
        badge: plan.badge || null,
        features: plan.features || []
      };
    });

    return ok({
      annualPromo: pricing.annualPromo || '',
      addOn: pricing.addOn || null,
      notes: pricing.notes || [],
      plans: plans
    });
  }

  function getCompanySubscription(routeValue) {
    var developer = getCompanyByRoute(routeValue);
    var pricing = getPricing();
    var planId = developer && pricing.companyPlans && pricing.companyPlans[developer.slug] ||
      pricing.defaultPlan ||
      'business';
    var plan = getPlanById(planId);
    var objects = getObjectsForCompany(developer);

    return ok({
      company_id: developer ? developer.slug : '',
      developer_slug: developer ? developer.slug : '',
      plan_id: plan ? plan.id : planId,
      plan_name: plan ? plan.name : '',
      status: 'manual',
      period: 'monthly',
      cards_limit: plan ? plan.cardsLimit : 0,
      cards_used: objects.length,
      additional_cards_count: 0,
      price_label: plan ? plan.price + ' / ' + (plan.period || 'мес') : ''
    });
  }

  function getCompanyCabinet(routeValue) {
    var developer = getCompanyByRoute(routeValue);
    if (!developer) {
      return {
        ok: false,
        source: 'mock',
        error: {
          code: 'company_not_found',
          message: 'Компания не найдена'
        }
      };
    }

    var config = getCompanyConfig(developer);
    var objects = getObjectsForCompany(developer);
    var subscription = getCompanySubscription(developer.slug).data;

    return ok({
      company: {
        id: developer.slug,
        developer_slug: developer.slug,
        name: config.companyName,
        type: 'developer',
        status: 'published',
        verification_status: 'verified',
        cover_url: developer.bgImage || ''
      },
      viewer: {
        user_id: 'usr_demo_maria',
        role: config.currentRole,
        permissions: []
      },
      summary: {
        profile_status_label: config.profileStatusLabel,
        health_label: config.healthLabel,
        lead: config.lead
      },
      objects: objects,
      billing: subscription,
      documents: config.documents,
      posts: config.posts,
      stories: config.stories,
      subscriber_segments: config.subscriberSegments,
      reviews: config.reviews,
      dialogs: config.dialogs,
      offers: config.offers
    });
  }

  function getMe() {
    var siteConfig = window.KLIPER_SITE_CONFIG || {};
    var user = siteConfig.defaultUser || {};
    return ok({
      user: {
        id: 'usr_demo_maria',
        display_name: user.name || 'Мария',
        phone: null,
        email: null,
        avatar_url: user.avatar || null,
        city_id: 'tyumen',
        status: 'demo'
      },
      profile: {
        is_public: true,
        reviews_visibility: 'public',
        collections_visibility: 'public'
      },
      companies: []
    });
  }

  function getMigrationPreview() {
    var likes = toArray(readJsonStorage('kliper-liked-cards', []));
    var subscriptions = toArray(readJsonStorage('kliper-subscribed-cards', []));
    var districts = toArray(readJsonStorage('kliper-subscribed-districts', []));
    var reviews = readJsonStorage('kliper-card-reviews', {});
    var reviewCount = Array.isArray(reviews) ? reviews.length : Object.keys(reviews || {}).length;

    return ok({
      likes: { local_count: likes.length, matched_count: likes.length, unmatched_count: 0 },
      subscriptions: { local_count: subscriptions.length, matched_count: subscriptions.length, unmatched_count: 0 },
      district_subscriptions: { local_count: districts.length, matched_count: districts.length, unmatched_count: 0 },
      reviews: { local_count: reviewCount, matched_count: reviewCount, unmatched_count: 0 }
    });
  }

  window.KLIPER_API_MOCK = {
    getMe: getMe,
    getBillingPlans: getBillingPlans,
    getCompanySubscription: getCompanySubscription,
    getCompanyCabinet: getCompanyCabinet,
    getMigrationPreview: getMigrationPreview
  };
})();

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const port = Number(process.env.KLIPER_MOCK_API_PORT || 4000);
const context = { window: {}, console };
context.window.window = context.window;
vm.createContext(context);

[
  'js/data/developers.js',
  'js/data/buildings.js',
  'js/data/company-cabinet.js',
  'js/data/company-pricing.js'
].forEach((relativePath) => {
  const filePath = path.join(rootDir, relativePath);
  vm.runInContext(fs.readFileSync(filePath, 'utf8'), context, { filename: relativePath });
});

function toArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalize(value) {
  return String(value || '').trim().toLowerCase();
}

function send(response, status, payload) {
  response.writeHead(status, {
    'Access-Control-Allow-Origin': 'http://127.0.0.1:8765',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json; charset=utf-8'
  });
  response.end(JSON.stringify(payload, null, 2));
}

function ok(data) {
  return { ok: true, data };
}

function error(code, message) {
  return { ok: false, error: { code, message } };
}

function getCompany(routeValue) {
  const developers = toArray(context.window.KLIPER_DEVELOPERS);
  const route = normalize(routeValue);
  return developers.find((developer) => normalize(developer.slug) === route || normalize(developer.name) === route) || null;
}

function getCompanyConfig(developer) {
  const source = context.window.KLIPER_COMPANY_CABINET || {};
  const defaults = source.defaults || {};
  const company = developer && source.companies ? source.companies[developer.slug] || {} : {};
  return {
    companyId: company.companyId || developer.slug,
    companyName: company.companyName || developer.name,
    currentRole: company.currentRole || defaults.currentRole || 'company_owner',
    profileStatusLabel: company.profileStatusLabel || defaults.profileStatusLabel || 'Профиль опубликован',
    healthLabel: company.healthLabel || defaults.healthLabel || 'Проверки перед публикацией',
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

function getObjects(developer) {
  return toArray(context.window.KLIPER_BUILDINGS)
    .filter((object) => object.developer === developer.name)
    .slice(0, 8);
}

function getPricing() {
  return context.window.KLIPER_COMPANY_PRICING || { plans: [], notes: [] };
}

function getPlan(developer) {
  const pricing = getPricing();
  const planId = pricing.companyPlans && developer ? pricing.companyPlans[developer.slug] : pricing.defaultPlan;
  return toArray(pricing.plans).find((plan) => plan.id === planId) || toArray(pricing.plans)[0] || null;
}

function billingPlans() {
  const pricing = getPricing();
  return ok({
    annualPromo: pricing.annualPromo || '',
    addOn: pricing.addOn || null,
    notes: pricing.notes || [],
    plans: toArray(pricing.plans)
  });
}

function subscription(companyId) {
  const company = getCompany(companyId);
  if (!company) return error('company_not_found', 'Компания не найдена');
  const plan = getPlan(company);
  const objects = getObjects(company);
  return ok({
    company_id: company.slug,
    developer_slug: company.slug,
    plan_id: plan ? plan.id : '',
    plan_name: plan ? plan.name : '',
    status: 'mock',
    period: 'monthly',
    cards_limit: plan ? plan.cardsLimit : 0,
    cards_used: objects.length,
    additional_cards_count: 0,
    price_label: plan ? `${plan.price} / ${plan.period || 'мес'}` : ''
  });
}

function cabinet(companyId) {
  const company = getCompany(companyId);
  if (!company) return error('company_not_found', 'Компания не найдена');
  const config = getCompanyConfig(company);
  return ok({
    company: {
      id: company.slug,
      developer_slug: company.slug,
      name: config.companyName,
      type: 'developer',
      status: 'published',
      verification_status: 'verified',
      cover_url: company.bgImage || ''
    },
    viewer: { user_id: 'usr_demo_maria', role: config.currentRole, permissions: [] },
    summary: {
      profile_status_label: config.profileStatusLabel,
      health_label: config.healthLabel,
      lead: config.lead
    },
    objects: getObjects(company),
    billing: subscription(company.slug).data,
    documents: config.documents,
    posts: config.posts,
    stories: config.stories,
    subscriber_segments: config.subscriberSegments,
    reviews: config.reviews,
    dialogs: config.dialogs,
    offers: config.offers
  });
}

function migrationPreview() {
  return ok({
    likes: { local_count: 0, matched_count: 0, unmatched_count: 0 },
    subscriptions: { local_count: 0, matched_count: 0, unmatched_count: 0 },
    district_subscriptions: { local_count: 0, matched_count: 0, unmatched_count: 0 },
    reviews: { local_count: 0, matched_count: 0, unmatched_count: 0 }
  });
}

const server = http.createServer((request, response) => {
  const url = new URL(request.url || '/', `http://${request.headers.host || '127.0.0.1'}`);
  const pathName = decodeURIComponent(url.pathname);

  if (request.method === 'OPTIONS') {
    send(response, 204, {});
    return;
  }

  if (request.method !== 'GET') {
    send(response, 405, error('method_not_allowed', 'Метод не поддерживается'));
    return;
  }

  if (pathName === '/api/v1/health') {
    send(response, 200, ok({ status: 'ok', service: 'kliper-api-mock', version: 'v1' }));
    return;
  }

  if (pathName === '/api/v1/me') {
    send(response, 200, ok({
      user: {
        id: 'usr_demo_maria',
        display_name: 'Мария',
        phone: null,
        email: null,
        avatar_url: null,
        city_id: 'tyumen',
        status: 'demo'
      },
      profile: { is_public: true, reviews_visibility: 'public', collections_visibility: 'public' },
      companies: []
    }));
    return;
  }

  if (pathName === '/api/v1/billing/plans') {
    send(response, 200, billingPlans());
    return;
  }

  const subscriptionMatch = pathName.match(/^\/api\/v1\/companies\/([^/]+)\/subscription$/);
  if (subscriptionMatch) {
    const payload = subscription(subscriptionMatch[1]);
    send(response, payload.ok ? 200 : 404, payload);
    return;
  }

  const cabinetMatch = pathName.match(/^\/api\/v1\/companies\/([^/]+)\/cabinet$/);
  if (cabinetMatch) {
    const payload = cabinet(cabinetMatch[1]);
    send(response, payload.ok ? 200 : 404, payload);
    return;
  }

  if (pathName === '/api/v1/me/migration-preview') {
    send(response, 200, migrationPreview());
    return;
  }

  send(response, 404, error('not_found', 'Endpoint не найден'));
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Kliper mock API: http://127.0.0.1:${port}/api/v1`);
});

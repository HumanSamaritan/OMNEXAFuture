const assert = require('node:assert/strict');
const { test, beforeEach } = require('node:test');
const Module = require('node:module');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const originalLoad = Module._load;
const originalResolve = Module._resolveFilename;
const sent = new Map();
let rejectRecipient = '';
Module._resolveFilename = function (name, parent, ...args) {
  return originalResolve.call(this, name.startsWith('@/') ? path.join(root, name.slice(2)) : name, parent, ...args);
};
Module._extensions['.ts'] = (module, filename) => {
  const output = ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
  module._compile(output.outputText, filename);
};
Module._load = function (name, parent, main) {
  if (name === 'resend') return { Resend: class {
    emails = { send: async (payload, options) => {
      if (payload.to === rejectRecipient) return { error: { name: 'application_error' }, data: null };
      const key = options.idempotencyKey;
      const existing = sent.get(key);
      if (existing && JSON.stringify(existing.payload) !== JSON.stringify(payload)) return { error: { name: 'invalid_idempotency_key' }, data: null };
      if (!existing) sent.set(key, { payload, id: `email-${sent.size + 1}` });
      return { error: null, data: { id: sent.get(key).id } };
    } };
  } };
  return originalLoad.call(this, name, parent, main);
};
Object.assign(process.env, { VERCEL_ENV: 'preview', PILOT_SIGNING_SECRET: 'qa-only-32-byte-secret-not-a-live-credential', RESEND_API_KEY: 'qa-fake-key', CONTACT_FROM_EMAIL: 'OMNeXa <noreply@omnexagoc.com>', NEXT_PUBLIC_RECAPTCHA_SITE_KEY: 'qa-site', RECAPTCHA_PROJECT_ID: 'qa-project', RECAPTCHA_ENTERPRISE_API_KEY: 'qa-key' });
global.fetch = async (_url, options) => ({ ok: true, json: async () => ({ tokenProperties: { valid: JSON.parse(options.body).event.token === 'qa-valid-captcha', hostname: 'localhost' } }) });
const server = require('../lib/pilot-server.ts');
const { validatePilotApplication } = require('../lib/pilot-validation.ts');
const { pilotProducts } = require('../lib/pilot-catalog.ts');
const { PILOT_AGREEMENT_VERSION } = require('../lib/pilot-agreement.ts');
const sessionRoute = require('../app/api/pilot/session/route.ts');
const verifyRoute = require('../app/api/pilot/verify/route.ts');
const applyRoute = require('../app/api/pilot/apply/route.ts');
const request = (body, overrides = {}) => new Request('https://preview.example/api/pilot/session', { method: 'POST', headers: { origin: 'https://preview.example', 'content-type': 'application/json', 'x-forwarded-for': '192.0.2.10', ...overrides }, body: JSON.stringify(body) });
const draft = (slug = 'human-machine-sadhana') => {
  const product = pilotProducts.find(p => p.slug === slug);
  return { productSlug: slug, initiativeSlug: product.initiativeSlug, fullName: 'Preview Test Applicant', email: 'pilot-test@example.com', country: 'Singapore', organisation: product.audience === 'B2B' ? 'Preview Test Organisation' : '', role: 'Preview evaluator', experienceLevel: 'Personal or lived experience', experience: 'I have relevant everyday experience and would like to provide structured feedback.', goals: 'I would test clarity, accessibility and the overall user experience.', availability: '1–2 hours per week' };
};
async function verified(slug) {
  const application = draft(slug);
  const response = await sessionRoute.POST(request({ application, privacyConsent: true, adultConsent: true, captchaToken: 'qa-valid-captcha' }));
  assert.equal(response.status, 200);
  const result = await response.json();
  const message = [...sent.values()].find(s => s.payload.subject.includes('verification code'));
  const code = message.payload.text.match(/code is (\d{6})/)[1];
  const check = await verifyRoute.POST(request({ challenge: result.challenge, code }));
  assert.equal(check.status, 200);
  return { ...(await check.json()), application, challenge: result.challenge, code };
}
function signed(session, extra = {}) {
  return { session: session.session, signature: session.application.fullName, signatureActionTime: new Date().toISOString(), agreementVersion: PILOT_AGREEMENT_VERSION, ndaConsent: true, privacyConsent: true, adultConsent: true, benefitConsent: true, authorityConsent: true, ...extra };
}
beforeEach(() => { sent.clear(); rejectRecipient = ''; global.__omnexaPilotLimits?.clear(); process.env.VERCEL_ENV = 'preview'; });

test('all 12 initiatives classify explicitly; 7 B2C and 5 B2B', () => {
  assert.equal(pilotProducts.length, 12);
  assert.equal(pilotProducts.filter(p => p.audience === 'B2C').length, 7);
  assert.equal(pilotProducts.filter(p => p.audience === 'B2B').length, 5);
  pilotProducts.forEach(p => assert.equal(validatePilotApplication(draft(p.slug)).productSlug, p.slug));
});
test('rejects unlisted products, mismatched initiatives, invalid fields and missing B2B organisation', () => {
  for (const change of [{productSlug:'unknown'}, {initiativeSlug:'wrong'}, {email:'bad\nemail@example.com'}, {experience:'short'}, {availability:'arbitrary'}]) assert.throws(() => validatePilotApplication({...draft(), ...change}));
  assert.throws(() => validatePilotApplication({...draft('nexaaml'), organisation:''}));
});
test('requires origin, JSON, object body and a bounded body size', async () => {
  for (const [req, status] of [[request({}, {origin:'https://other.example'}),403], [request({}, {'content-type':'text/plain'}),415], [request(null),400], [request({x:'a'.repeat(31000)}),413]]) assert.equal((await sessionRoute.POST(req)).status,status);
});
test('email code issuance requires adult/data consent and a valid reCAPTCHA', async () => {
  for (const extra of [{adultConsent:false}, {privacyConsent:false}, {captchaToken:'bad'}]) {
    const res = await sessionRoute.POST(request({application:draft(), adultConsent:true, privacyConsent:true,captchaToken:'qa-valid-captcha',...extra}));
    assert.equal(res.status,400);
  }
  assert.equal(sent.size,0);
});
test('verification token hides application/code and rejects tampering and expiry', async () => {
  const session = await verified();
  assert.ok(!Buffer.from(session.challenge,'base64url').toString().includes(session.application.email));
  assert.throws(() => server.readPilotToken('broken' + session.challenge.slice(6),'challenge'));
  const expired = server.sealPilotToken({...server.readPilotToken(session.challenge,'challenge'),expiresAt:Date.now()-1});
  assert.throws(() => server.readPilotToken(expired,'challenge'));
});
test('wrong code and repeated attempts never produce a verified session', async () => {
  const session = await verified();
  for(let i=0;i<4;i++) assert.equal((await verifyRoute.POST(request({challenge:session.challenge,code:'000000'}))).status,400);
  assert.equal((await verifyRoute.POST(request({challenge:session.challenge,code:session.code}))).status,429);
});
test('signature, NDA, age, benefit, version and B2B authority are enforced on the server', async () => {
  const session = await verified('nexaaml');
  for(const change of [{signature:'Someone Else'},{ndaConsent:false},{adultConsent:false},{privacyConsent:false},{benefitConsent:false},{authorityConsent:false}]) assert.equal((await applyRoute.POST(request(signed(session,change)))).status,400);
  assert.equal((await applyRoute.POST(request(signed(session,{agreementVersion:'old'})))).status,409);
  assert.equal(sent.size,1);
});
test('B2C submission queues the complete support record and applicant receipt with benefit and NDA copies', async () => {
  const session=await verified();
  const res=await applyRoute.POST(request(signed(session)));
  assert.equal(res.status,200); const result=await res.json();
  assert.equal(result.preview,true);assert.equal(result.receiptQueued,true);
  assert.equal(sent.size,3);
  const support=[...sent.values()].find(s=>s.payload.to==='support@omnexagoc.com').payload;
  const receipt=[...sent.values()].find(s=>s.payload.subject.includes('We received')).payload;
  assert.equal(receipt.to,session.application.email);
  assert.ok(support.text.includes(session.application.experience));
  assert.ok(support.text.includes('1–2 hours per week'));
  assert.ok(support.subject.includes('PREVIEW TEST'));
  assert.ok(receipt.text.includes('12 consecutive months'));
  assert.equal(support.attachments.length,2);assert.equal(receipt.attachments.length,1);
  const record=JSON.parse(Buffer.from(support.attachments[1].content,'base64').toString());
  assert.equal(record.product,'Human Machine Sadhana');assert.equal(record.signature,session.application.fullName);
  assert.equal(record.agreementVersion,PILOT_AGREEMENT_VERSION);assert.equal(record.agreementSha256.length,64);
  assert.equal(Buffer.from(receipt.attachments[0].content,'base64').toString(),result.agreementCopy);
});
test('B2B receipts explicitly exclude the free individual subscription offer',async()=>{
  const session=await verified('nexaforge');
  assert.equal((await applyRoute.POST(request(signed(session)))).status,200);
  const receipt=[...sent.values()].find(s=>s.payload.subject.includes('We received')).payload;
  assert.ok(receipt.text.includes('one-year free individual subscription offer does not apply'));
});
test('a support delivery failure never claims receipt or emails the applicant',async()=>{
  const session=await verified(); rejectRecipient='support@omnexagoc.com';
  const res=await applyRoute.POST(request(signed(session)));
  assert.equal(res.status,502);assert.equal(sent.size,1);
});
test('a receipt failure is explicit; retry sends only the missing receipt',async()=>{
  const session=await verified(); const body=signed(session);rejectRecipient=session.application.email;
  const first=await (await applyRoute.POST(request(body))).json();
  assert.equal(first.ok,true);assert.equal(first.receiptQueued,false);assert.equal(sent.size,2);
  rejectRecipient='';const retry=await (await applyRoute.POST(request(body))).json();
  assert.equal(retry.receiptQueued,true);assert.equal(sent.size,3);
  assert.equal(retry.agreementCopy,first.agreementCopy);
  await applyRoute.POST(request(body));assert.equal(sent.size,3);
});
test('preview tokens cannot be used in production',async()=>{
  const session=await verified();process.env.VERCEL_ENV='production';
  assert.equal((await applyRoute.POST(request(signed(session)))).status,401);
});

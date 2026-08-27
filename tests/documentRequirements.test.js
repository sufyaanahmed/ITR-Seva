import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { describe, test } from 'node:test';

// SmartDocuments is a JSX browser component, which Node cannot import without a
// JSX loader. Exercise its actual exported, pure requirement model by loading
// the implementation prefix before the browser/JSX helpers. This keeps the test
// dependency-free and fails if the export is removed or moved unexpectedly.
const smartDocumentsUrl = new URL('../src/components/SmartDocuments.jsx', import.meta.url);
const smartDocumentsSource = await readFile(smartDocumentsUrl, 'utf8');
const browserHelperOffset = smartDocumentsSource.indexOf('const readImageDimensions');
assert.notEqual(browserHelperOffset, -1, 'SmartDocuments browser-helper boundary must remain discoverable');

const pureRequirementSource = smartDocumentsSource
  .slice(0, browserHelperOffset)
  .replace(/^import .*;\n/gm, '');
const requirementModuleUrl = `data:text/javascript;base64,${Buffer.from(pureRequirementSource).toString('base64')}`;
const { getRequiredDocuments } = await import(requirementModuleUrl);

const byType = (requirements) => new Map(requirements.map((requirement) => [requirement.type, requirement]));
const types = (data) => getRequiredDocuments(data).map((requirement) => requirement.type);

const assertVerifiedEvisaFormats = (requirements) => {
  const documents = byType(requirements);
  const photograph = documents.get('photograph');
  const passport = documents.get('passport');

  assert.deepEqual(photograph.extensions, ['jpg', 'jpeg']);
  assert.deepEqual(photograph.mimeTypes, ['image/jpeg']);
  assert.equal(photograph.minBytes, 10 * 1024);
  assert.equal(photograph.maxBytes, 1024 * 1024);
  assert.equal(photograph.square, true);
  assert.match(photograph.rule, /JPEG, 10 KB–1 MB, square/);

  assert.deepEqual(passport.extensions, ['pdf']);
  assert.deepEqual(passport.mimeTypes, ['application/pdf']);
  assert.equal(passport.minBytes, 10 * 1024);
  assert.equal(passport.maxBytes, 300 * 1024);
  assert.match(passport.rule, /PDF, 10–300 KB/);
};

describe('e-Visa document requirements', () => {
  test('tourist requires only the verified photograph and passport formats', () => {
    const requirements = getRequiredDocuments({ application_type: 'evisa', visa_category: 'tourist' });

    assert.deepEqual(types({ application_type: 'evisa', visa_category: 'tourist' }), ['photograph', 'passport']);
    assertVerifiedEvisaFormats(requirements);
  });

  test('business adds the business card PDF', () => {
    const requirements = getRequiredDocuments({ application_type: 'evisa', visa_category: 'business' });
    const documents = byType(requirements);

    assert.deepEqual([...documents.keys()], ['photograph', 'passport', 'business_card']);
    assertVerifiedEvisaFormats(requirements);
    assert.deepEqual(documents.get('business_card').extensions, ['pdf']);
    assert.equal(documents.get('business_card').maxBytes, 300 * 1024);
  });

  test('medical adds an Indian hospital letter PDF', () => {
    const requirements = getRequiredDocuments({ application_type: 'evisa', visa_category: 'medical' });
    const documents = byType(requirements);

    assert.deepEqual([...documents.keys()], ['photograph', 'passport', 'hospital_letter']);
    assertVerifiedEvisaFormats(requirements);
    assert.match(documents.get('hospital_letter').title, /hospital letter/i);
    assert.deepEqual(documents.get('hospital_letter').mimeTypes, ['application/pdf']);
  });

  test('production investment adds its purpose-specific evidence', () => {
    assert.deepEqual(
      types({ application_type: 'evisa', visa_category: 'production-investment' }),
      ['photograph', 'passport', 'production_investment_evidence'],
    );
  });

  test('student adds admission and financial/guardian evidence instead of falling back to tourist', () => {
    const requirements = getRequiredDocuments({ application_type: 'evisa', visa_category: 'student' });
    const documents = byType(requirements);

    assert.deepEqual([...documents.keys()], ['photograph', 'passport', 'admission_letter', 'financial_guardian_support']);
    assertVerifiedEvisaFormats(requirements);
    assert.match(documents.get('admission_letter').desc, /e-Student/);
    assert.deepEqual(documents.get('admission_letter').mimeTypes, ['application/pdf']);
    assert.equal(documents.get('admission_letter').maxBytes, 300 * 1024);
    assert.match(documents.get('financial_guardian_support').title, /financial.*guardian/i);
    assert.deepEqual(documents.get('financial_guardian_support').mimeTypes, ['application/pdf']);
  });

  test('e-Student adds a medical-course NOC only for medical or paramedical study', () => {
    assert.deepEqual(
      types({ application_type: 'evisa', visa_category: 'student', student_course_type: 'general-course' }),
      ['photograph', 'passport', 'admission_letter', 'financial_guardian_support'],
    );
    const medicalRequirements = getRequiredDocuments({ application_type: 'evisa', visa_category: 'student', student_course_type: 'medical-paramedical' });
    const medicalDocuments = byType(medicalRequirements);
    assert.deepEqual(
      [...medicalDocuments.keys()],
      ['photograph', 'passport', 'admission_letter', 'financial_guardian_support', 'medical_course_noc'],
    );
    assert.match(medicalDocuments.get('medical_course_noc').title, /approval|NOC/i);
    assert.deepEqual(medicalDocuments.get('medical_course_noc').mimeTypes, ['application/pdf']);
    assert.equal(medicalDocuments.get('medical_course_noc').maxBytes, 300 * 1024);
  });
});

describe('Afghan route document requirements', () => {
  const commonTypes = ['photograph', 'passport', 'tazkira'];

  test('uses mandatory common evidence without inventing unverified byte limits', () => {
    const requirements = getRequiredDocuments({ application_type: 'afghan', visa_category: 'medical' });
    const documents = byType(requirements);

    for (const type of commonTypes) assert.ok(documents.has(type), type);
    assert.equal(documents.get('photograph').minBytes, null);
    assert.equal(documents.get('photograph').maxBytes, null);
    assert.equal(documents.get('photograph').square, false);
    assert.equal(documents.get('passport').minBytes, null);
    assert.equal(documents.get('passport').maxBytes, null);
    assert.match(documents.get('passport').rule, /not verifiable/);
  });

  test('medical includes the hospital invitation and conditional minor consent', () => {
    assert.deepEqual(
      types({ application_type: 'afghan', visa_category: 'medical', is_minor: 'yes' }),
      [...commonTypes, 'hospital_letter', 'minor_consent'],
    );
  });

  test('medical attendant includes the linked patient invitation', () => {
    assert.deepEqual(
      types({ application_type: 'afghan', visa_category: 'medical-attendant' }),
      [...commonTypes, 'hospital_letter'],
    );
  });

  test('student includes admission, financial support, and undertaking evidence', () => {
    assert.deepEqual(
      types({ application_type: 'afghan', visa_category: 'student', afghan_purpose: 'new-student' }),
      [...commonTypes, 'admission_letter', 'financial_support', 'student_undertaking'],
    );
  });

  test('business includes the representative company and chamber evidence', () => {
    assert.deepEqual(
      types({ application_type: 'afghan', visa_category: 'business', afghan_purpose: 'business-general' }),
      [...commonTypes, 'india_company_invitation', 'resident_company_letter', 'chamber_recommendation'],
    );
  });

  test('entry includes subtype-specific supporting evidence', () => {
    assert.deepEqual(
      types({ application_type: 'afghan', visa_category: 'entry', afghan_purpose: 'family' }),
      [...commonTypes, 'entry_purpose_evidence'],
    );
  });

  test('UN diplomat includes official assignment or visit evidence', () => {
    assert.deepEqual(
      types({ application_type: 'afghan', visa_category: 'un-diplomat', afghan_purpose: 'assigned' }),
      [...commonTypes, 'un_diplomat_note'],
    );
  });
});

describe('non-e-Visa requirement models', () => {
  test('regular visa uses a mission-specific demo checklist without universal limits', () => {
    const requirements = getRequiredDocuments({ application_type: 'regular' });
    const documents = byType(requirements);

    assert.deepEqual([...documents.keys()], ['photograph', 'passport', 'purpose_support']);
    assert.equal(documents.get('photograph').minBytes, null);
    assert.equal(documents.get('passport').maxBytes, null);
    assert.match(documents.get('photograph').rule, /vary by mission/);
    assert.match(documents.get('purpose_support').rule, /not a Government upload/);
  });

  test('Visa on Arrival does not request an online upload', () => {
    assert.deepEqual(getRequiredDocuments({ application_type: 'voa', visa_category: 'tourist' }), []);
  });
});

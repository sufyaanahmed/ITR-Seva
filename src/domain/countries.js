import { PASSPORT_NATIONALITIES } from '../data/visaEligibilityRules.js';

export const normalizeCountry = (value) => String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '');

const aliases = {
  'United Arab Emirates': ['UAE', 'U.A.E.', 'Emirates'],
  'United States': ['US', 'USA', 'U.S.A.', 'United States of America'],
  'United Kingdom': ['UK', 'U.K.', 'Britain', 'Great Britain'],
  'South Korea': ['Republic of Korea', 'Korea South'],
  'North Korea': ['DPRK', 'Korea North'],
  'Czechia': ['Czech Republic'],
  'Cabo Verde': ['Cape Verde'],
  'Turkey': ['Türkiye'],
  "Cote d'Ivoire": ['Ivory Coast', 'Côte d’Ivoire'],
};

export function searchNationalities(query) {
  const normalized = normalizeCountry(query);
  return PASSPORT_NATIONALITIES.filter((country) => [country, ...(aliases[country] || [])]
    .some((name) => normalizeCountry(name).includes(normalized)));
}

export function resolveNationality(query) {
  const normalized = normalizeCountry(query);
  return PASSPORT_NATIONALITIES.find((country) => [country, ...(aliases[country] || [])]
    .some((name) => normalizeCountry(name) === normalized));
}

const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });
const codes = 'AF AL DZ AD AO AI AG AR AM AW AU AT AZ BS BH BD BB BY BE BZ BJ BT BO BA BW BR BN BG BF BI CV KH CM CA KY CF TD CL CN CO KM CG CK CR CI HR CU CY CZ CD DK DJ DM DO EC EG SV GQ ER EE SZ ET FJ FI FR GA GM GE DE GH GI GR GD GT GG GN GW GY HT HN HU IS ID IR IQ IE IM IL IT JM JP JE JO KZ KE KI KW KG LA LV LB LS LR LY LI LT LU MG MW MY MV ML MT MH MR MU MX FM MD MC MN ME MS MA MZ MM NA NR NP NL NZ NI NE NG NU KP MK NO OM PK PW PS PA PG PY PE PH PL PT QA RO RU RW KN LC VC WS SM ST SA SN RS SC SL SG SK SI SB SO ZA KR SS ES LK SD SR SE CH SY TW TJ TZ TH TL TG TO TT TN TR TM TC TV UG UA AE GB US UY UZ VU VA VE VN YE ZM ZW'.split(' ');
const countryCodes = Object.fromEntries(codes.map((code) => [normalizeCountry(regionNames.of(code)), code]));
Object.assign(countryCodes, {
  congo: 'CG', democraticrepublicofthecongo: 'CD', palestinestate: 'PS', turkey: 'TR', vaticancity: 'VA',
  antiguaandbarbuda: 'AG', bosniaandherzegovina: 'BA', caboverde: 'CV', myanmar: 'MM',
  saintkittsandnevis: 'KN', saintlucia: 'LC', saintvincentandthegrenadines: 'VC',
  saotomeandprincipe: 'ST', trinidadandtobago: 'TT', turksandcaicosislands: 'TC',
});

export function countryFlag(country) {
  const code = countryCodes[normalizeCountry(country)];
  return code ? String.fromCodePoint(...[...code].map((letter) => 127397 + letter.charCodeAt(0))) : '';
}

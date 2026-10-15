// 대한민국 공적개발원조(ODA) 협력국 정보 — 세계지도 팝업과 나라 소개에 쓴다.
//
// 출처: ODA Korea(https://odakorea.go.kr/eng/program/recipientIndex)의 협력국 목록(93개국)과
//       KOICA(https://www.koica.go.kr)가 밝힌 2021~2025 중점협력국 27개국 구성(아시아 12·아프리카 7·중앙아시아/CIS 4·중남미 4).
// 중점협력국 구분은 위 두 자료로 확인했다. 단, 중앙아시아/CIS 4개국 중 타지키스탄은 KOICA 자료에 이름이 직접 나오지 않고
// ODA Korea 목록의 나열 순서(중점협력국이 먼저 나옴)로 확인한 것이라 공식 자료로 한 번 더 확인하는 것이 좋다.
// 2026년 이후 중점협력국 명단은 바뀔 수 있다 (콜롬비아·미얀마·우크라이나 제외, 케냐 추가가 검토 중이라는 보도가 있었으나 확정 전).
// 수도·공용어는 널리 알려진 사실이며, 인구처럼 자주 바뀌는 숫자는 일부러 넣지 않았다.

export type AidTier = "priority" | "partner"; // 중점협력국 / 그 밖의 협력국
export type AidRegion = "asia" | "cis" | "pacific" | "latin" | "africa";

export type AidCountry = {
  id: string; // 지도 데이터의 나라 번호(ISO 3166-1 숫자 코드)
  name: string; // 한국어 이름
  en: string; // 영어 이름
  region: AidRegion;
  tier: AidTier;
  capital: string; // 수도(한국어)
  languages: string; // 공용어(한국어)
  wiki: string; // 한국어 위키백과 문서 제목
  marker?: [number, number]; // 너무 작아서 지도에서 눌러 고르기 어려운 섬나라는 점으로도 표시한다 [경도, 위도]
};

const p = "priority";
const o = "partner";

export const AID_COUNTRIES: AidCountry[] = [
  // ───── 아시아 ─────
  { id: "524", name: "네팔", en: "Nepal", region: "asia", tier: p, capital: "카트만두", languages: "네팔어", wiki: "네팔" },
  { id: "418", name: "라오스", en: "Laos", region: "asia", tier: p, capital: "비엔티안", languages: "라오어", wiki: "라오스" },
  { id: "496", name: "몽골", en: "Mongolia", region: "asia", tier: p, capital: "울란바토르", languages: "몽골어", wiki: "몽골" },
  { id: "104", name: "미얀마", en: "Myanmar", region: "asia", tier: p, capital: "네피도", languages: "미얀마어(버마어)", wiki: "미얀마" },
  { id: "050", name: "방글라데시", en: "Bangladesh", region: "asia", tier: p, capital: "다카", languages: "벵골어", wiki: "방글라데시" },
  { id: "704", name: "베트남", en: "Vietnam", region: "asia", tier: p, capital: "하노이", languages: "베트남어", wiki: "베트남" },
  { id: "144", name: "스리랑카", en: "Sri Lanka", region: "asia", tier: p, capital: "스리자야와르데네푸라코테", languages: "싱할라어, 타밀어", wiki: "스리랑카" },
  { id: "356", name: "인도", en: "India", region: "asia", tier: p, capital: "뉴델리", languages: "힌디어, 영어", wiki: "인도" },
  { id: "360", name: "인도네시아", en: "Indonesia", region: "asia", tier: p, capital: "자카르타", languages: "인도네시아어", wiki: "인도네시아" },
  { id: "116", name: "캄보디아", en: "Cambodia", region: "asia", tier: p, capital: "프놈펜", languages: "크메르어", wiki: "캄보디아" },
  { id: "586", name: "파키스탄", en: "Pakistan", region: "asia", tier: p, capital: "이슬라마바드", languages: "우르두어, 영어", wiki: "파키스탄" },
  { id: "608", name: "필리핀", en: "Philippines", region: "asia", tier: p, capital: "마닐라", languages: "필리핀어, 영어", wiki: "필리핀" },
  { id: "626", name: "동티모르", en: "Timor-Leste", region: "asia", tier: o, capital: "딜리", languages: "테툼어, 포르투갈어", wiki: "동티모르" },
  { id: "458", name: "말레이시아", en: "Malaysia", region: "asia", tier: o, capital: "쿠알라룸푸르", languages: "말레이어", wiki: "말레이시아" },
  { id: "064", name: "부탄", en: "Bhutan", region: "asia", tier: o, capital: "팀푸", languages: "종카어", wiki: "부탄" },
  { id: "004", name: "아프가니스탄", en: "Afghanistan", region: "asia", tier: o, capital: "카불", languages: "다리어, 파슈토어", wiki: "아프가니스탄" },
  { id: "764", name: "태국", en: "Thailand", region: "asia", tier: o, capital: "방콕", languages: "태국어", wiki: "태국" },

  // ───── 중앙아시아·CIS·중동·동유럽 ─────
  { id: "860", name: "우즈베키스탄", en: "Uzbekistan", region: "cis", tier: p, capital: "타슈켄트", languages: "우즈베크어", wiki: "우즈베키스탄" },
  { id: "804", name: "우크라이나", en: "Ukraine", region: "cis", tier: p, capital: "키이우", languages: "우크라이나어", wiki: "우크라이나" },
  { id: "417", name: "키르기스스탄", en: "Kyrgyzstan", region: "cis", tier: p, capital: "비슈케크", languages: "키르기스어, 러시아어", wiki: "키르기스스탄" },
  { id: "762", name: "타지키스탄", en: "Tajikistan", region: "cis", tier: p, capital: "두샨베", languages: "타지크어", wiki: "타지키스탄" },
  { id: "498", name: "몰도바", en: "Moldova", region: "cis", tier: o, capital: "키시너우", languages: "루마니아어(몰도바어)", wiki: "몰도바" },
  { id: "070", name: "보스니아 헤르체고비나", en: "Bosnia and Herzegovina", region: "cis", tier: o, capital: "사라예보", languages: "보스니아어, 세르비아어, 크로아티아어", wiki: "보스니아 헤르체고비나" },
  { id: "807", name: "북마케도니아", en: "North Macedonia", region: "cis", tier: o, capital: "스코페", languages: "마케도니아어", wiki: "북마케도니아" },
  { id: "688", name: "세르비아", en: "Serbia", region: "cis", tier: o, capital: "베오그라드", languages: "세르비아어", wiki: "세르비아" },
  { id: "051", name: "아르메니아", en: "Armenia", region: "cis", tier: o, capital: "예레반", languages: "아르메니아어", wiki: "아르메니아" },
  { id: "031", name: "아제르바이잔", en: "Azerbaijan", region: "cis", tier: o, capital: "바쿠", languages: "아제르바이잔어", wiki: "아제르바이잔" },
  { id: "008", name: "알바니아", en: "Albania", region: "cis", tier: o, capital: "티라나", languages: "알바니아어", wiki: "알바니아" },
  { id: "400", name: "요르단", en: "Jordan", region: "cis", tier: o, capital: "암만", languages: "아랍어", wiki: "요르단" },
  { id: "368", name: "이라크", en: "Iraq", region: "cis", tier: o, capital: "바그다드", languages: "아랍어, 쿠르드어", wiki: "이라크" },
  { id: "364", name: "이란", en: "Iran", region: "cis", tier: o, capital: "테헤란", languages: "페르시아어", wiki: "이란" },
  { id: "268", name: "조지아", en: "Georgia", region: "cis", tier: o, capital: "트빌리시", languages: "조지아어", wiki: "조지아" },
  { id: "398", name: "카자흐스탄", en: "Kazakhstan", region: "cis", tier: o, capital: "아스타나", languages: "카자흐어, 러시아어", wiki: "카자흐스탄" },
  { id: "795", name: "투르크메니스탄", en: "Turkmenistan", region: "cis", tier: o, capital: "아시가바트", languages: "투르크멘어", wiki: "투르크메니스탄" },
  { id: "792", name: "튀르키예", en: "Türkiye", region: "cis", tier: o, capital: "앙카라", languages: "튀르키예어", wiki: "튀르키예" },

  // ───── 태평양 ─────
  { id: "584", name: "마셜 제도", en: "Marshall Islands", region: "pacific", tier: o, capital: "마주로", languages: "마셜어, 영어", wiki: "마셜 제도", marker: [171.2, 7.1] },
  { id: "882", name: "사모아", en: "Samoa", region: "pacific", tier: o, capital: "아피아", languages: "사모아어, 영어", wiki: "사모아", marker: [-172.1, -13.8] },
  { id: "090", name: "솔로몬 제도", en: "Solomon Islands", region: "pacific", tier: o, capital: "호니아라", languages: "영어", wiki: "솔로몬 제도" },
  { id: "296", name: "키리바시", en: "Kiribati", region: "pacific", tier: o, capital: "타라와", languages: "키리바시어, 영어", wiki: "키리바시", marker: [173.0, 1.4] },
  { id: "798", name: "투발루", en: "Tuvalu", region: "pacific", tier: o, capital: "푸나푸티", languages: "투발루어, 영어", wiki: "투발루", marker: [179.2, -8.5] },
  { id: "598", name: "파푸아뉴기니", en: "Papua New Guinea", region: "pacific", tier: o, capital: "포트모르즈비", languages: "영어, 톡피신, 히리모투어", wiki: "파푸아뉴기니" },
  { id: "242", name: "피지", en: "Fiji", region: "pacific", tier: o, capital: "수바", languages: "영어, 피지어, 힌디어", wiki: "피지" },

  // ───── 중남미 ─────
  { id: "068", name: "볼리비아", en: "Bolivia", region: "latin", tier: p, capital: "수크레(행정 수도 라파스)", languages: "스페인어와 원주민 언어", wiki: "볼리비아" },
  { id: "170", name: "콜롬비아", en: "Colombia", region: "latin", tier: p, capital: "보고타", languages: "스페인어", wiki: "콜롬비아" },
  { id: "600", name: "파라과이", en: "Paraguay", region: "latin", tier: p, capital: "아순시온", languages: "스페인어, 과라니어", wiki: "파라과이" },
  { id: "604", name: "페루", en: "Peru", region: "latin", tier: p, capital: "리마", languages: "스페인어, 케추아어", wiki: "페루" },
  { id: "328", name: "가이아나", en: "Guyana", region: "latin", tier: o, capital: "조지타운", languages: "영어", wiki: "가이아나" },
  { id: "320", name: "과테말라", en: "Guatemala", region: "latin", tier: o, capital: "과테말라시티", languages: "스페인어", wiki: "과테말라" },
  { id: "558", name: "니카라과", en: "Nicaragua", region: "latin", tier: o, capital: "마나과", languages: "스페인어", wiki: "니카라과" },
  { id: "214", name: "도미니카 공화국", en: "Dominican Republic", region: "latin", tier: o, capital: "산토도밍고", languages: "스페인어", wiki: "도미니카 공화국" },
  { id: "084", name: "벨리즈", en: "Belize", region: "latin", tier: o, capital: "벨모판", languages: "영어", wiki: "벨리즈" },
  { id: "032", name: "아르헨티나", en: "Argentina", region: "latin", tier: o, capital: "부에노스아이레스", languages: "스페인어", wiki: "아르헨티나" },
  { id: "332", name: "아이티", en: "Haiti", region: "latin", tier: o, capital: "포르토프랭스", languages: "아이티 크레올어, 프랑스어", wiki: "아이티" },
  { id: "218", name: "에콰도르", en: "Ecuador", region: "latin", tier: o, capital: "키토", languages: "스페인어", wiki: "에콰도르" },
  { id: "222", name: "엘살바도르", en: "El Salvador", region: "latin", tier: o, capital: "산살바도르", languages: "스페인어", wiki: "엘살바도르" },
  { id: "340", name: "온두라스", en: "Honduras", region: "latin", tier: o, capital: "테구시갈파", languages: "스페인어", wiki: "온두라스" },
  { id: "188", name: "코스타리카", en: "Costa Rica", region: "latin", tier: o, capital: "산호세", languages: "스페인어", wiki: "코스타리카" },
  { id: "192", name: "쿠바", en: "Cuba", region: "latin", tier: o, capital: "아바나", languages: "스페인어", wiki: "쿠바" },
  { id: "591", name: "파나마", en: "Panama", region: "latin", tier: o, capital: "파나마시티", languages: "스페인어", wiki: "파나마" },

  // ───── 아프리카 ─────
  { id: "288", name: "가나", en: "Ghana", region: "africa", tier: p, capital: "아크라", languages: "영어", wiki: "가나" },
  { id: "646", name: "르완다", en: "Rwanda", region: "africa", tier: p, capital: "키갈리", languages: "키냐르완다어, 영어, 프랑스어", wiki: "르완다" },
  { id: "686", name: "세네갈", en: "Senegal", region: "africa", tier: p, capital: "다카르", languages: "프랑스어", wiki: "세네갈" },
  { id: "231", name: "에티오피아", en: "Ethiopia", region: "africa", tier: p, capital: "아디스아바바", languages: "암하라어", wiki: "에티오피아" },
  { id: "800", name: "우간다", en: "Uganda", region: "africa", tier: p, capital: "캄팔라", languages: "영어, 스와힐리어", wiki: "우간다" },
  { id: "818", name: "이집트", en: "Egypt", region: "africa", tier: p, capital: "카이로", languages: "아랍어", wiki: "이집트" },
  { id: "834", name: "탄자니아", en: "Tanzania", region: "africa", tier: p, capital: "도도마", languages: "스와힐리어, 영어", wiki: "탄자니아" },
  { id: "180", name: "콩고 민주 공화국", en: "Dem. Rep. Congo", region: "africa", tier: o, capital: "킨샤사", languages: "프랑스어", wiki: "콩고 민주 공화국" },
  { id: "266", name: "가봉", en: "Gabon", region: "africa", tier: o, capital: "리브르빌", languages: "프랑스어", wiki: "가봉" },
  { id: "270", name: "감비아", en: "Gambia", region: "africa", tier: o, capital: "반줄", languages: "영어", wiki: "감비아" },
  { id: "324", name: "기니", en: "Guinea", region: "africa", tier: o, capital: "코나크리", languages: "프랑스어", wiki: "기니" },
  { id: "566", name: "나이지리아", en: "Nigeria", region: "africa", tier: o, capital: "아부자", languages: "영어", wiki: "나이지리아" },
  { id: "710", name: "남아프리카 공화국", en: "South Africa", region: "africa", tier: o, capital: "프리토리아(행정)·케이프타운(입법)·블룸폰테인(사법)", languages: "영어, 줄루어, 아프리칸스어 등 12개 언어", wiki: "남아프리카 공화국" },
  { id: "450", name: "마다가스카르", en: "Madagascar", region: "africa", tier: o, capital: "안타나나리보", languages: "말라가시어, 프랑스어", wiki: "마다가스카르" },
  { id: "454", name: "말라위", en: "Malawi", region: "africa", tier: o, capital: "릴롱궤", languages: "영어, 치체와어", wiki: "말라위" },
  { id: "466", name: "말리", en: "Mali", region: "africa", tier: o, capital: "바마코", languages: "프랑스어", wiki: "말리" },
  { id: "504", name: "모로코", en: "Morocco", region: "africa", tier: o, capital: "라바트", languages: "아랍어, 아마지그어", wiki: "모로코" },
  { id: "480", name: "모리셔스", en: "Mauritius", region: "africa", tier: o, capital: "포트루이스", languages: "영어(공식), 프랑스어, 모리스 크레올어", wiki: "모리셔스", marker: [57.55, -20.25] },
  { id: "508", name: "모잠비크", en: "Mozambique", region: "africa", tier: o, capital: "마푸투", languages: "포르투갈어", wiki: "모잠비크" },
  { id: "108", name: "부룬디", en: "Burundi", region: "africa", tier: o, capital: "기테가(정치)·부줌부라(경제)", languages: "키룬디어, 프랑스어, 영어", wiki: "부룬디" },
  { id: "854", name: "부르키나파소", en: "Burkina Faso", region: "africa", tier: o, capital: "와가두구", languages: "프랑스어", wiki: "부르키나파소" },
  { id: "729", name: "수단", en: "Sudan", region: "africa", tier: o, capital: "하르툼", languages: "아랍어, 영어", wiki: "수단" },
  { id: "694", name: "시에라리온", en: "Sierra Leone", region: "africa", tier: o, capital: "프리타운", languages: "영어", wiki: "시에라리온" },
  { id: "012", name: "알제리", en: "Algeria", region: "africa", tier: o, capital: "알제", languages: "아랍어, 아마지그어", wiki: "알제리" },
  { id: "024", name: "앙골라", en: "Angola", region: "africa", tier: o, capital: "루안다", languages: "포르투갈어", wiki: "앙골라" },
  { id: "748", name: "에스와티니", en: "eSwatini", region: "africa", tier: o, capital: "음바바네(행정)·로밤바(왕실·입법)", languages: "스와티어, 영어", wiki: "에스와티니" },
  { id: "894", name: "잠비아", en: "Zambia", region: "africa", tier: o, capital: "루사카", languages: "영어", wiki: "잠비아" },
  { id: "716", name: "짐바브웨", en: "Zimbabwe", region: "africa", tier: o, capital: "하라레", languages: "영어, 쇼나어, 은데벨레어 등 16개 언어", wiki: "짐바브웨" },
  { id: "148", name: "차드", en: "Chad", region: "africa", tier: o, capital: "은자메나", languages: "프랑스어, 아랍어", wiki: "차드" },
  { id: "120", name: "카메룬", en: "Cameroon", region: "africa", tier: o, capital: "야운데", languages: "프랑스어, 영어", wiki: "카메룬" },
  { id: "404", name: "케냐", en: "Kenya", region: "africa", tier: o, capital: "나이로비", languages: "스와힐리어, 영어", wiki: "케냐" },
  { id: "384", name: "코트디부아르", en: "Côte d'Ivoire", region: "africa", tier: o, capital: "야무수크로(행정)·아비장(경제)", languages: "프랑스어", wiki: "코트디부아르" },
  { id: "768", name: "토고", en: "Togo", region: "africa", tier: o, capital: "로메", languages: "프랑스어", wiki: "토고" },
  { id: "788", name: "튀니지", en: "Tunisia", region: "africa", tier: o, capital: "튀니스", languages: "아랍어", wiki: "튀니지" },
];

export const REGION_NAMES: Record<AidRegion, string> = {
  asia: "아시아",
  cis: "중앙아시아·CIS·중동·동유럽",
  pacific: "태평양",
  latin: "중남미",
  africa: "아프리카",
};

export const TIER_NAMES: Record<AidTier, string> = {
  priority: "중점협력국",
  partner: "협력국",
};

export const AID_BY_ID: Record<string, AidCountry> = Object.fromEntries(AID_COUNTRIES.map((country) => [country.id, country]));

export const ODA_KOREA_URL = "https://odakorea.go.kr/";
export const wikipediaUrl = (country: AidCountry) =>
  `https://ko.wikipedia.org/wiki/${encodeURIComponent(country.wiki.replaceAll(" ", "_"))}`;

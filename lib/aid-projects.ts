// 중점협력국별 "대한민국이 지원하는 사업" 자료 — 나라 소개 팝업에 쓴다.
//
// 출처: KOICA 해외사무소 페이지·국가협력전략(CPS), 현지·국내 언론 보도, 주재 대사관 페이지 (나라마다 sources에 적음).
// 자료에서 확인된 내용만 적었다. 확인하지 못한 항목은 비워 두었고, 화면에는 "확인된 정보가 없다"고 보여 준다.
// 사업 목록은 자주 바뀐다. 기준(asOf)을 함께 보여 주며, 최신 내용은 ODA Korea·KOICA에서 확인하도록 안내한다.
// 중점협력국이 아닌 협력국(66개국)은 아직 조사하지 않아 이 파일에 없다.

export type AidProject = {
  title: string; // 사업명
  detail?: string; // 한 줄 설명 (기간·규모는 자료에 있을 때만)
};

export type AidSupport = {
  fields: string[]; // 중점 협력 분야
  projects: AidProject[]; // 대표 사업
  note?: string; // 덧붙일 말 (자료의 한계 등)
  sources: string[]; // 근거 주소
  asOf: string; // 자료의 기준
};

export const AID_SUPPORT: Record<string, AidSupport> = {
  // ───── 아시아 ─────
  "524": {
    fields: ["물관리 및 보건위생", "교육", "지역개발", "에너지"],
    projects: [
      { title: "박타푸르 취약지역 빈곤층 건강수준 향상을 위한 역량강화 및 의료인프라 개선 사업", detail: "보건 분야, 2022~2027년, 950만 달러" },
      { title: "Province 2 지역 건설기술인력 양성을 위한 모델 폴리텍 설립사업", detail: "교육 분야, 2021~2027년, 860만 달러" },
      { title: "포카라시 리사이클/업사이클 플랫폼 및 친환경 시범마을 구축을 통한 녹색일자리 창출 사업", detail: "농촌개발 분야, 2023~2029년, 980만 달러" },
    ],
    sources: ["https://koica.go.kr/sites/nepal_kr/index.do"],
    asOf: "KOICA 네팔사무소 진행 사업 목록(2026년 게시), 분야는 네팔 CPS 2016~2020 설명",
  },
  "418": {
    fields: ["농촌개발", "보건개발", "기술 및 고등교육", "교통"],
    projects: [],
    sources: ["https://koica.go.kr/sites/lao_kr/index.do"],
    asOf: "KOICA 라오스 국가지원계획(2023.01), 제3기 CPS",
  },
  "496": {
    fields: ["지속가능한 발전을 위한 거버넌스 향상", "지속가능한 도시개발 및 복원력 강화", "경제성장 인프라 확충 및 교통안전 개선", "포용적 농목축업 개발 및 농식품 안전성 강화"],
    projects: [
      { title: "폐의류 재고(캐시미어) Textile-to-Textile 서큘레이션 센터 구축사업" },
      { title: "울란바토르시 지속가능한 4계절 온실 구축 사업", detail: "협의의사록 체결로 소개됨" },
    ],
    note: "사업 기간과 규모는 확인하지 못했습니다.",
    sources: ["https://koica.go.kr/sites/mng_kr/index.do"],
    asOf: "KOICA 몽골사무소 '몽골 국가협력전략 2023'과 최근 소식",
  },
  "104": {
    fields: ["거버넌스", "농촌개발", "교통", "에너지"],
    projects: [],
    note: "확인한 자료가 2016~2020 국가협력전략이라 현재와 다를 수 있습니다.",
    sources: ["https://koica.go.kr/mmr_en/3848/subview.do"],
    asOf: "Korea's CPS for Myanmar 2016-2020",
  },
  "050": {
    fields: ["교육", "교통", "물관리 및 보건위생", "공공행정"],
    projects: [],
    sources: ["https://koica.go.kr/sites/bgd_kr/index.do"],
    asOf: "방글라데시 국가협력전략(제3기 CPS, 2022년), 분야별 중기전략 2021~2025",
  },
  "704": {
    fields: ["교통", "보건위생", "환경", "교육", "공공행정"],
    projects: [],
    note: "사업 현황이 그림 파일로만 게시되어 사업 이름은 확인하지 못했습니다.",
    sources: ["https://www.koica.go.kr/vnm_kr/3610/subview.do"],
    asOf: "베트남 제3기 CPS",
  },
  "144": {
    fields: ["교육", "교통", "물관리 및 위생", "지역개발"],
    projects: [],
    sources: ["https://koica.go.kr/lka_kr/3899/subview.do"],
    asOf: "스리랑카 CPS 2021~2025",
  },
  "356": {
    fields: [],
    projects: [],
    note: "인도 자료는 열람할 수 없어 확인하지 못했습니다.",
    sources: ["https://www.odakorea.go.kr/kor/cont/ContShow?cont_seq=22"],
    asOf: "ODA Korea 국가협력전략 안내 페이지",
  },
  "360": {
    fields: ["교통", "공공행정", "환경보호", "물관리"],
    projects: [],
    sources: ["https://koica.go.kr/idn_kr/3933/subview.do"],
    asOf: "인도네시아 국가협력전략(2021년 표기)",
  },
  "116": {
    fields: ["물관리 및 보건위생", "교육", "농촌개발", "교통"],
    projects: [],
    sources: ["https://www.koica.go.kr/khm_kr/3984/subview.do"],
    asOf: "캄보디아 CPS 2021~2025",
  },
  "586": {
    fields: ["물관리 및 보건위생", "에너지", "지역개발", "교통"],
    projects: [
      { title: "KP주 아보타바드시 하베리안지역 상수도시설 구축사업", detail: "2021~2028년, 1,200만 달러" },
      { title: "펀잡주 물탄시 홍수방재 마스터플랜 수립 및 우수저류시설 설치사업", detail: "2024~2029년, 1,000만 달러" },
      { title: "태양전지모듈 인증시험소 설립 사업", detail: "2019~2026년, 950만 달러" },
    ],
    sources: ["https://www.koica.go.kr/pak_kr/4052/subview.do"],
    asOf: "KOICA 파키스탄사무소 진행 사업 목록(2026년 게시), 분야는 파키스탄 CPS 2021~2025",
  },
  "608": {
    fields: ["교통", "물관리 및 보건위생", "기후변화·환경", "지역개발(식량안보)", "ICT"],
    projects: [
      { title: "메트로 마닐라 통합 홍수관리체계 구축", detail: "물관리 분야, 2021~2026년, 1,270만 달러" },
      { title: "마카티시 스마트 대중교통체계 구축", detail: "교통 분야, 2022~2027년, 1,300만 달러" },
      { title: "경찰청 범죄수사정보 통합관리 시스템 구축", detail: "ICT 분야, 2023~2028년, 690만 달러" },
    ],
    note: "진행 중인 사업 20건 중 10건만 확인한 목록입니다.",
    sources: ["https://www.koica.go.kr/phl_kr/4018/subview.do"],
    asOf: "필리핀 CPS(2023.6), KOICA 필리핀사무소 진행 사업",
  },

  // ───── 중앙아시아·CIS ─────
  "860": {
    fields: ["교육", "디지털", "감염병 대응"],
    projects: [
      { title: "UWED 사이버대학 설립을 위한 온라인 교육 제도 구축 및 환경 조성 사업", detail: "세계경제외교대학 온라인 교육 기반 구축" },
      { title: "IT Park 지속성장 기반조성 및 역량강화 사업", detail: "2021년 업무협약" },
    ],
    note: "분야는 2022~2024 무상원조 협정(14건, 8,800만 달러)의 중심 내용으로, 국가협력전략 원문은 확인하지 못했습니다.",
    sources: ["https://kun.uz/en/news/2025/03/11/uzbekistan-and-koica-expand-partnership-with-key-development-projects"],
    asOf: "2021·2025년 언론 보도",
  },
  "417": {
    fields: [],
    projects: [
      { title: "소방구조체계 현대화 사업", detail: "소방서 4개 신축, 소방차 12대 지원, 소방 교육훈련 (KOICA·UNDP 735만 달러, 2021년 착공식)" },
      { title: "전력계통 안정화 및 효율화를 위한 분산전원 제어 SCADA/DMS 구축사업", detail: "2024년 공공협력사업 선정" },
    ],
    sources: ["https://www.ajunews.com/view/20210405110359020"],
    asOf: "2021·2024년 언론 보도 (국가협력전략 원문 미확인)",
  },
  "762": {
    fields: [],
    projects: [],
    note: "제3차 국제개발협력 기본계획에서 처음 중점협력국으로 선정되었다는 자료만 확인했고, 분야와 사업은 확인하지 못했습니다.",
    sources: ["https://repository.krei.re.kr/handle/2018.oak/28168"],
    asOf: "2021년 한국농촌경제연구원 보고서",
  },
  "804": {
    fields: [],
    projects: [],
    note: "KOICA의 공식 자료를 확인하지 못했습니다.",
    sources: [],
    asOf: "확인 자료 없음",
  },

  // ───── 아프리카 ─────
  "288": {
    fields: [],
    projects: [{ title: "농업 가치사슬 강화 사업", detail: "농업 현대화·농촌 소득·일자리 창출 지원, 약 950만 달러 (기간 미확인)" }],
    note: "대가나 누적 ODA가 4억 달러를 넘었다는 보도가 있었습니다.",
    sources: ["https://gna.org.gh/2024/10/koreas-development-assistance-to-ghana-surpasses-400-million-pledges-further-cooperation/"],
    asOf: "2024년 보도 (국가협력전략 원문 미확인)",
  },
  "646": {
    fields: ["교육"],
    projects: [
      { title: "직업기술교육훈련(TVET) 산학협력 역량강화", detail: "2023~2025년, 한국기술교육대학교 수행" },
      { title: "ICT 활용 교육 촉진을 위한 지도교사 및 장학 역량강화", detail: "2021~2023년" },
    ],
    sources: ["https://dhnews.co.kr/news/view/1065593167718131"],
    asOf: "2025년 언론 보도 (국가협력전략 원문 미확인)",
  },
  "686": {
    fields: ["에너지", "농촌개발"],
    projects: [{ title: "농촌 개발을 위한 에너지 자립 역량 강화 사업", detail: "한전KDN 주관, 에너지자립마을 모델 이전, 2026~2030년 총 69억 원" }],
    sources: ["https://www.fnnews.com/news/202609061015102918"],
    asOf: "2026년 언론 보도 (국가협력전략 원문 미확인)",
  },
  "231": {
    fields: ["제조업", "보건", "농촌개발", "민간부문 협력"],
    projects: [],
    note: "에티오피아 재무부가 밝힌 KOICA의 2026~2027년 추진 예정 분야이며, 국가협력전략 내용은 아닙니다.",
    sources: ["https://www.mofed.gov.et/blog/ethiopia-and-korea-strengthen-bilateral-partnership-focus-on-private-sector-collaboration/"],
    asOf: "에티오피아 재무부 게시물",
  },
  "800": {
    fields: ["농업", "농촌개발"],
    projects: [
      { title: "테소(Teso) 지역 과일 가공공장" },
      { title: "국립농민지도자센터(National Farmers Leadership Center)", detail: "농업 인력 양성" },
      { title: "한국 밀레니엄 빌리지 사업", detail: "농촌 개발" },
    ],
    note: "규모와 기간은 확인하지 못했습니다.",
    sources: ["https://overseas.mofa.go.kr/ug-en/wpge/m_10291/contents.do"],
    asOf: "주우간다 대한민국 대사관 페이지 (시점 미표기)",
  },
  "818": {
    fields: [],
    projects: [],
    note: "2021년 중점협력국으로 지정되었고 중동·북아프리카에서는 유일한 중점협력국입니다. KOICA 대이집트 예산은 2020년 326만 달러에서 2024년 1,260만 달러로 늘었다고 합니다. 분야와 사업은 확인하지 못했습니다.",
    sources: ["https://www.segye.com/newsView/20241127515494"],
    asOf: "2024년 언론 보도",
  },
  "834": {
    fields: ["교육", "보건", "물·위생"],
    projects: [
      { title: "STEM 교육 사업", detail: "모델학교 13곳에 과학실험실·ICT 시설 구축, 학생 3,000명 이상 수혜 (1,000만 달러)" },
      { title: "직업기술교육훈련(TVET) 사업", detail: "모로고로 폴리테크닉 칼리지 건설과 훈련교사 양성 (1,950만 달러)" },
      { title: "디지털 보건센터(GoTHoMIS) 사업", detail: "도도마 235개 시설 ICT 장비 설치, 일차보건소 153곳에 보건정보시스템 도입 (1,000만 달러)" },
      { title: "키사라웨 상수도 사업", detail: "19개 마을에 상수도 공급, 2031년 완공 목표 (900만 달러)" },
    ],
    note: "총 약정액은 4,850만 달러라고 보도되었습니다. 분야는 보도 기준입니다.",
    sources: ["https://www.thecitizen.co.tz/tanzania/news/national/koica-projects-worth-sh126-billion-set-to-support-govt-development-plan-5476224"],
    asOf: "2026년 5월 보도 (국가협력전략 원문 아님)",
  },

  // ───── 중남미 ─────
  "068": {
    fields: ["보건·위생", "농촌개발", "교통", "에너지"],
    projects: [],
    note: "2024년 지원액은 약 1,050만 달러입니다. 사업 이름은 확인하지 못했습니다.",
    sources: ["https://www.koica.go.kr/sites/bol_en/index.do"],
    asOf: "KOICA 볼리비아사무소 페이지 (기준 연도 미표기)",
  },
  "170": {
    fields: ["공공행정", "평화구축", "산업개발", "지역개발", "기후변화·환경"],
    projects: [{ title: "한국전 참전용사 및 후손 재활센터 지원", detail: "내전 부상 참전용사와 후손을 위한 재활센터 (1,300만 달러, 2018년 지원)" }],
    note: "2024년 지원액은 약 580만 달러입니다. 확인한 페이지가 오래되어 최신 내용과 다를 수 있습니다.",
    sources: ["https://www.koica.go.kr/col_en/4952/subview.do"],
    asOf: "KOICA 콜롬비아사무소 페이지 (2018년 표기)",
  },
  "600": {
    fields: ["보건", "교통", "지역개발", "공공행정"],
    projects: [
      { title: "항공 전문인력 역량강화 사업", detail: "교육센터·격납고 건립, 훈련용 항공기와 실습 기자재 도입" },
      { title: "새마을운동(SMU) 지속가능 농업 사업", detail: "지역개발 분야" },
      { title: "UNA ICT 혁신센터 건립", detail: "시공·감리 입찰공고(2024년)" },
    ],
    note: "2024년 지원액은 약 810만 달러입니다. 사업 규모와 기간은 확인하지 못했습니다.",
    sources: ["https://www.koica.go.kr/sites/pry_en/index.do"],
    asOf: "KOICA 파라과이사무소 페이지 (최신 항목 2025.9)",
  },
  "604": {
    fields: ["보건", "공공행정(거버넌스)", "기후변화·환경", "교통"],
    projects: [
      { title: "수막 후스티시아(Sumaq Justicia) 사업", detail: "UNDP·페루 사법부와 수행한 사법 분야 사업 (2024년 성과보고회)" },
      { title: "제3 한-페루 의료센터 리모델링", detail: "산후안데루리간초, 설계용역 입찰 진행" },
    ],
    note: "2024년 지원액은 약 940만 달러입니다. 사업 규모는 확인하지 못했습니다.",
    sources: ["https://www.koica.go.kr/sites/per_en/index.do"],
    asOf: "KOICA 페루사무소 페이지 (최신 항목 2026.2)",
  },
};

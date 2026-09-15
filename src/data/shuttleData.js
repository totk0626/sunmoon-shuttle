// 2026-2학기 선문대학교 셔틀버스 시간표 데이터 (2026.9.1 ~ 12.14)

export const HOLIDAY_NOTICES = [
  { title: '추석 연휴', date: '9.24(목) ~ 9.26(토)', note: '셔틀버스 운행 없음', type: 'off' },
  { title: '개천절 휴무', date: '10.3(토) ~ 10.4(일)', note: '셔틀버스 운행 없음', type: 'off' },
  { title: '개천절 대체휴일', date: '10.5(월)', note: '일요일 시간표로 운행', type: 'special' },
  { title: '한글날', date: '10.9(금)', note: '셔틀버스 운행 없음', type: 'off' },
  { title: '개교기념일', date: '10.28(수)', note: '셔틀버스 운행 없음', type: 'off' }
];

export const GENERAL_INFO = {
  payment: '모든 선·후불 교통카드 (수협, 씨티 제외) 사용 가능, 현금 사용 불가',
  stopLocationNotice: '학기 중 평일 학생회관 승강장 정차시간: 13:30~15:30 / 19:30~막차까지 이용 가능 (이외 시간은 공대 승강장)',
  contact: '041-544-8710',
  term: '2026. 9. 1.(화) ~ 12. 14.(월)',
  safetyRules: [
    '출퇴근 시간 교통량 증가, 공사, 기상 등으로 일부 지연될 수 있습니다.',
    '탑승자의 안전을 위해 입석 승차는 탑승정원의 25% 내외로 제한됩니다.',
    '중간경유지 승차장소에서는 차량 확인 후 손을 들어 승차표시를 해주세요.'
  ]
};

export const ROUTES = [
  {
    id: 'cheonan_asan_tangjeong',
    name: '천안아산역 · 탕정역',
    shortName: '아산/탕정역',
    color: '#2563eb',
    badge: '인기 노선',
    pathSummary: {
      to_school: '천안아산역/아산역 ➔ 아산캠퍼스',
      to_station: '아산캠퍼스 ➔ 탕정역 경유 ➔ 시티프라디움 ➔ 천안아산역'
    },
    travelTime: {
      to_school: '약 15분 소요',
      to_station: '약 20분 소요 (탕정역 경유)'
    },
    trafficNotice: {
      to_school: null,
      to_station: '2026-2학기부터 하교 시 무조건 탕정역 경유'
    },
    stops: [
      { id: 'campusDep', name: '아산캠퍼스 출발', type: 'dep' },
      { id: 'asanDep', name: '천안아산역 출발', type: 'waypoint' },
      { id: 'campusArr', name: '아산캠퍼스 도착', type: 'arr' }
    ],
    schedule: [
      { id: 1, campusDep: '08:05', asanDep: '08:25', campusArr: '08:40', friOff: false, note: '' },
      { id: 2, campusDep: null, asanDep: '08:35', campusArr: '08:50', friOff: true, note: '금(X)' },
      { id: 3, campusDep: null, asanDep: '08:40', campusArr: '08:55', friOff: true, note: '금(X)' },
      { id: 4, campusDep: null, asanDep: '08:45', campusArr: '09:00', friOff: false, note: '월-목 2대 운행' },
      { id: 5, campusDep: null, asanDep: '08:50', campusArr: '09:05', friOff: true, note: '금(X)' },
      { id: 6, campusDep: null, asanDep: '08:55', campusArr: '09:10', friOff: false, note: '' },
      { id: 7, campusDep: null, asanDep: '09:00', campusArr: '09:15', friOff: false, note: '월-목 2대 운행' },
      { id: 8, campusDep: null, asanDep: '09:05', campusArr: '09:20', friOff: true, note: '금(X)' },
      { id: 9, campusDep: null, asanDep: '09:10', campusArr: '09:25', friOff: false, note: '' },
      { id: 10, campusDep: null, asanDep: '09:15', campusArr: '09:30', friOff: true, note: '금(X)' },
      { id: 11, campusDep: '09:30', asanDep: '09:50', campusArr: '10:05', friOff: false, note: '' },
      { id: 12, campusDep: '09:50', asanDep: '10:10', campusArr: '10:25', friOff: false, note: '' },
      { id: 13, campusDep: '10:20', asanDep: '10:40', campusArr: '10:55', friOff: true, note: '금(X)' },
      { id: 14, campusDep: '10:30', asanDep: '10:50', campusArr: '11:05', friOff: false, note: '' },
      { id: 15, campusDep: '10:45', asanDep: '11:05', campusArr: '11:20', friOff: false, note: '' },
      { id: 16, campusDep: '10:55', asanDep: '11:15', campusArr: '11:30', friOff: true, note: '금(X)' },
      { id: 17, campusDep: '11:25', asanDep: '11:45', campusArr: '12:00', friOff: true, note: '금(X)' },
      { id: 18, campusDep: '11:45', asanDep: '12:05', campusArr: '12:20', friOff: false, note: '' },
      { id: 19, campusDep: '12:15', asanDep: '12:35', campusArr: '12:50', friOff: true, note: '금(X)' },
      { id: 20, campusDep: '12:35', asanDep: '12:55', campusArr: '13:10', friOff: false, note: '' },
      { id: 21, campusDep: '13:10', asanDep: '13:30', campusArr: '13:45', friOff: true, note: '금(X)' },
      { id: 22, campusDep: '13:40', asanDep: '14:00', campusArr: '14:15', friOff: false, note: '' },
      { id: 23, campusDep: '13:50', asanDep: '14:10', campusArr: '14:25', friOff: true, note: '금(X)' },
      { id: 24, campusDep: '14:40', asanDep: '15:00', campusArr: '15:15', friOff: false, note: '' },
      { id: 25, campusDep: '14:50', asanDep: '15:10', campusArr: '15:25', friOff: true, note: '금(X)' },
      { id: 26, campusDep: '15:30', asanDep: '15:50', campusArr: '16:05', friOff: false, note: '' },
      { id: 27, campusDep: '15:35', asanDep: '15:55', campusArr: '16:10', friOff: true, note: '금(X)' },
      { id: 28, campusDep: '15:40', asanDep: '16:00', campusArr: '16:15', friOff: false, note: '' },
      { id: 29, campusDep: '15:50', asanDep: '16:10', campusArr: '16:25', friOff: true, note: '금(X)' },
      { id: 30, campusDep: '16:30', asanDep: '16:50', campusArr: '17:05', friOff: false, note: '' },
      { id: 31, campusDep: '16:40', asanDep: '17:00', campusArr: '17:15', friOff: false, note: '' },
      { id: 32, campusDep: '16:50', asanDep: '17:10', campusArr: '17:25', friOff: true, note: '금(X)' },
      { id: 33, campusDep: '17:00', asanDep: '17:20', campusArr: '17:35', friOff: false, note: '' },
      { id: 34, campusDep: '17:30', asanDep: '17:50', campusArr: '18:05', friOff: true, note: '금(X)' },
      { id: 35, campusDep: '17:40', asanDep: '18:00', campusArr: '18:15', friOff: false, note: '' },
      { id: 36, campusDep: '17:50', asanDep: '18:10', campusArr: '18:25', friOff: true, note: '금(X)' },
      { id: 37, campusDep: '18:15', asanDep: '18:35', campusArr: '18:50', friOff: false, note: '' },
      { id: 38, campusDep: '18:35', asanDep: '18:55', campusArr: '19:10', friOff: false, note: '' },
      { id: 39, campusDep: '18:45', asanDep: '19:05', campusArr: '19:20', friOff: true, note: '금(X)' },
      { id: 40, campusDep: '19:45', asanDep: '20:05', campusArr: '20:20', friOff: false, note: '' },
      { id: 41, campusDep: '20:45', asanDep: '21:05', campusArr: '21:20', friOff: false, note: '' },
      { id: 42, campusDep: '21:15', asanDep: '21:35', campusArr: '21:50', friOff: false, note: '' }
    ]
  },
  {
    id: 'cheonan_station',
    name: '천안역 노선',
    shortName: '천안역',
    color: '#d97706',
    badge: '1호선 연계',
    pathSummary: {
      to_school: '천안역 ➔ 하이렉스파 ➔ 용암마을 ➔ 아산캠퍼스',
      to_station: '아산캠퍼스 ➔ 월봉동1단지 ➔ 쌍용동하이마트 ➔ 천안역'
    },
    travelTime: {
      to_school: '약 25분 소요',
      to_station: '약 30분 소요'
    },
    trafficNotice: {
      to_school: '출근 혼잡시간(08:00~09:00) 체증 시 +5분 소요 (약 30분)',
      to_station: '퇴근 혼잡시간(17:30~19:30) 체증 시 +5분 소요 (약 35분)'
    },
    stops: [
      { id: 'campusDep', name: '아산캠퍼스 출발', type: 'dep' },
      { id: 'cheonanDep', name: '천안역 출발', type: 'waypoint' },
      { id: 'campusArr', name: '아산캠퍼스 도착', type: 'arr' }
    ],
    schedule: [
      { id: 1, campusDep: null, cheonanDep: '07:40', campusArr: '08:45', friOff: false, note: '' },
      { id: 2, campusDep: null, cheonanDep: '08:15', campusArr: '09:00', friOff: true, note: '금(X)' },
      { id: 3, campusDep: null, cheonanDep: '08:30', campusArr: '09:10', friOff: false, note: '' },
      { id: 4, campusDep: null, cheonanDep: '08:45', campusArr: '09:15', friOff: true, note: '금(X)' },
      { id: 5, campusDep: null, cheonanDep: '08:50', campusArr: '09:05', friOff: false, note: '중간노선 (하이렉스파 출발)' },
      { id: 6, campusDep: null, cheonanDep: '08:50', campusArr: '09:20', friOff: false, note: '' },
      { id: 7, campusDep: null, cheonanDep: '09:00', campusArr: '09:30', friOff: true, note: '금(X)' },
      { id: 8, campusDep: null, cheonanDep: '09:05', campusArr: '09:35', friOff: false, note: '' },
      { id: 9, campusDep: null, cheonanDep: '09:30', campusArr: '09:55', friOff: true, note: '금(X)' },
      { id: 10, campusDep: '09:30', cheonanDep: '10:00', campusArr: '10:25', friOff: false, note: '' },
      { id: 11, campusDep: '10:00', cheonanDep: '10:30', campusArr: '10:55', friOff: true, note: '금(X)' },
      { id: 12, campusDep: '10:10', cheonanDep: '10:40', campusArr: '11:05', friOff: false, note: '' },
      { id: 13, campusDep: '10:30', cheonanDep: '11:00', campusArr: '11:25', friOff: true, note: '금(X)' },
      { id: 14, campusDep: '11:00', cheonanDep: '11:30', campusArr: '11:55', friOff: false, note: '' },
      { id: 15, campusDep: '11:30', cheonanDep: '12:00', campusArr: '12:25', friOff: true, note: '금(X)' },
      { id: 16, campusDep: '12:30', cheonanDep: '13:00', campusArr: '13:25', friOff: false, note: '' },
      { id: 17, campusDep: '13:30', cheonanDep: '14:00', campusArr: '14:25', friOff: true, note: '금(X)' },
      { id: 18, campusDep: '13:40', cheonanDep: '14:10', campusArr: '14:35', friOff: false, note: '' },
      { id: 19, campusDep: '14:30', cheonanDep: '15:00', campusArr: '15:25', friOff: true, note: '금(X)' },
      { id: 20, campusDep: '14:40', cheonanDep: '15:10', campusArr: '15:35', friOff: false, note: '' },
      { id: 21, campusDep: '15:30', cheonanDep: '16:00', campusArr: '16:25', friOff: true, note: '금(X)' },
      { id: 22, campusDep: '15:40', cheonanDep: '16:10', campusArr: '16:35', friOff: false, note: '' },
      { id: 23, campusDep: '15:50', cheonanDep: '16:20', campusArr: '16:45', friOff: true, note: '금(X)' },
      { id: 24, campusDep: '16:30', cheonanDep: '17:00', campusArr: '17:25', friOff: true, note: '금(X)' },
      { id: 25, campusDep: '16:40', cheonanDep: '17:10', campusArr: '17:35', friOff: false, note: '' },
      { id: 26, campusDep: '16:50', cheonanDep: '17:20', campusArr: '17:45', friOff: true, note: '금(X)' },
      { id: 27, campusDep: '17:40', cheonanDep: '18:15', campusArr: '18:45', friOff: false, note: '' },
      { id: 28, campusDep: '17:50', cheonanDep: '18:25', campusArr: '18:55', friOff: true, note: '금(X)' },
      { id: 29, campusDep: '18:40', cheonanDep: '19:15', campusArr: '19:45', friOff: false, note: '' },
      { id: 30, campusDep: '18:50', cheonanDep: '19:25', campusArr: '19:50', friOff: true, note: '금(X)' },
      { id: 31, campusDep: '19:30', cheonanDep: '19:55', campusArr: '20:20', friOff: false, note: '' },
      { id: 32, campusDep: '20:30', cheonanDep: '20:55', campusArr: '21:20', friOff: false, note: '' },
      { id: 33, campusDep: '21:20', cheonanDep: '21:45', campusArr: '22:10', friOff: true, note: '금(X)' }
    ]
  },
  {
    id: 'cheonan_terminal',
    name: '천안터미널 노선',
    shortName: '천안터미널',
    color: '#059669',
    badge: '시외/두정동',
    pathSummary: {
      to_school: '천안터미널 ➔ 두정동 ➔ 서울대정병원 ➔ 갤러리아 ➔ 아산캠퍼스',
      to_station: '아산캠퍼스 ➔ 불당상업지구 ➔ 한양병원 ➔ 천안터미널'
    },
    travelTime: {
      to_school: '약 30분 소요',
      to_station: '약 30분 소요'
    },
    trafficNotice: {
      to_school: '출근 혼잡시간(08:00~09:00) 체증 시 +10분 소요 (약 40분)',
      to_station: '퇴근 혼잡시간(16:30~19:30) 체증 시 +10분 소요 (약 40분)'
    },
    stops: [
      { id: 'campusDep', name: '아산캠퍼스 출발', type: 'dep' },
      { id: 'terminalDep', name: '천안터미널 출발', type: 'waypoint' },
      { id: 'campusArr', name: '아산캠퍼스 도착', type: 'arr' }
    ],
    schedule: [
      { id: 1, campusDep: '07:30', terminalDep: '08:10', campusArr: '08:50', friOff: false, note: '' },
      { id: 2, campusDep: null, terminalDep: '08:15', campusArr: '08:55', friOff: true, note: '금(X)' },
      { id: 3, campusDep: null, terminalDep: '08:25', campusArr: '09:05', friOff: false, note: '' },
      { id: 4, campusDep: null, terminalDep: '08:30', campusArr: '09:10', friOff: true, note: '금(X)' },
      { id: 5, campusDep: null, terminalDep: '08:35', campusArr: '09:15', friOff: false, note: '' },
      { id: 6, campusDep: null, terminalDep: '08:40', campusArr: '09:20', friOff: true, note: '금(X)' },
      { id: 7, campusDep: null, terminalDep: '08:45', campusArr: '09:25', friOff: false, note: '' },
      { id: 8, campusDep: null, terminalDep: '08:50', campusArr: '09:30', friOff: true, note: '금(X)' },
      { id: 9, campusDep: null, terminalDep: '08:55', campusArr: '09:10', friOff: false, note: '중간노선 (두정동 맥도날드 출발)' },
      { id: 10, campusDep: null, terminalDep: '09:30', campusArr: '10:00', friOff: false, note: '' },
      { id: 11, campusDep: '09:30', terminalDep: '10:00', campusArr: '10:30', friOff: false, note: '' },
      { id: 12, campusDep: '10:00', terminalDep: '10:30', campusArr: '11:00', friOff: true, note: '금(X)' },
      { id: 13, campusDep: '10:30', terminalDep: '11:00', campusArr: '11:30', friOff: false, note: '' },
      { id: 14, campusDep: '11:00', terminalDep: '11:30', campusArr: '12:00', friOff: true, note: '금(X)' },
      { id: 15, campusDep: '11:30', terminalDep: '12:00', campusArr: '12:30', friOff: false, note: '' },
      { id: 16, campusDep: '12:00', terminalDep: '12:30', campusArr: '13:00', friOff: true, note: '금(X)' },
      { id: 17, campusDep: '12:30', terminalDep: '13:00', campusArr: '13:30', friOff: false, note: '' },
      { id: 18, campusDep: '13:00', terminalDep: '13:30', campusArr: '14:00', friOff: true, note: '금(X)' },
      { id: 19, campusDep: '13:30', terminalDep: '14:00', campusArr: '14:30', friOff: false, note: '' },
      { id: 20, campusDep: '13:50', terminalDep: '14:20', campusArr: '14:50', friOff: true, note: '금(X)' },
      { id: 21, campusDep: '14:30', terminalDep: '15:00', campusArr: '15:30', friOff: false, note: '' },
      { id: 22, campusDep: '14:40', terminalDep: '15:10', campusArr: '15:40', friOff: false, note: '' },
      { id: 23, campusDep: '14:50', terminalDep: '15:20', campusArr: '15:50', friOff: true, note: '금(X)' },
      { id: 24, campusDep: '15:30', terminalDep: '16:00', campusArr: '16:30', friOff: false, note: '' },
      { id: 25, campusDep: '15:40', terminalDep: '16:10', campusArr: '16:40', friOff: false, note: '' },
      { id: 26, campusDep: '15:50', terminalDep: '16:20', campusArr: '16:50', friOff: true, note: '금(X)' },
      { id: 27, campusDep: '16:30', terminalDep: '17:10', campusArr: '17:50', friOff: true, note: '금(X)' },
      { id: 28, campusDep: '16:40', terminalDep: '17:20', campusArr: '18:00', friOff: false, note: '' },
      { id: 29, campusDep: '16:50', terminalDep: '17:30', campusArr: '18:10', friOff: true, note: '금(X)' },
      { id: 30, campusDep: '17:30', terminalDep: '18:10', campusArr: '18:50', friOff: true, note: '금(X)' },
      { id: 31, campusDep: '17:40', terminalDep: '18:20', campusArr: '19:00', friOff: false, note: '' },
      { id: 32, campusDep: '17:50', terminalDep: '18:30', campusArr: '19:10', friOff: true, note: '금(X)' },
      { id: 33, campusDep: '18:30', terminalDep: '19:10', campusArr: '19:50', friOff: true, note: '금(X)' },
      { id: 34, campusDep: '18:40', terminalDep: '19:20', campusArr: '20:00', friOff: false, note: '' },
      { id: 35, campusDep: '18:50', terminalDep: '19:30', campusArr: '20:10', friOff: true, note: '금(X)' },
      { id: 36, campusDep: '19:40', terminalDep: '20:10', campusArr: '20:40', friOff: false, note: '' },
      { id: 37, campusDep: '20:40', terminalDep: '21:10', campusArr: '21:40', friOff: false, note: '' },
      { id: 38, campusDep: '21:30', terminalDep: '22:00', campusArr: '22:30', friOff: true, note: '금(X)' }
    ]
  },
  {
    id: 'onyang_asan',
    name: '온양온천역 / 아산터미널',
    shortName: '온양/아산',
    color: '#ec4899',
    badge: '아산 시내',
    pathSummary: {
      to_school: '주공아파트 ➔ 온양온천역 ➔ 아산터미널 ➔ 권곡초 ➔ 아산캠퍼스',
      to_station: '아산캠퍼스 ➔ 주공아파트 ➔ 온양온천역 ➔ 아산터미널'
    },
    travelTime: {
      to_school: '약 20~25분 소요',
      to_station: '약 20~25분 소요'
    },
    trafficNotice: {
      to_school: '온양온천역 약 15분 / 아산터미널 약 20분 소요',
      to_station: '퇴근 시간대 시내 구간 일부 지연 가능'
    },
    stops: [
      { id: 'campusDep', name: '아산캠퍼스 출발', type: 'dep' },
      { id: 'jugongDep', name: '주공아파트', type: 'waypoint' },
      { id: 'onyangDep', name: '온양온천역', type: 'waypoint' },
      { id: 'terminalDep', name: '아산터미널', type: 'waypoint' },
      { id: 'campusArr', name: '아산캠퍼스 도착', type: 'arr' }
    ],
    schedule: [
      { id: 1, campusDep: null, jugongDep: '8:00', onyangDep: '8:10', terminalDep: '8:15', campusArr: '8:40', friOff: false, note: '' },
      { id: 2, campusDep: null, jugongDep: '-', onyangDep: '8:45', terminalDep: '8:50', campusArr: '9:15', friOff: true, note: '금(X)' },
      { id: 3, campusDep: null, jugongDep: '8:40', onyangDep: '8:50', terminalDep: '8:55', campusArr: '9:20', friOff: false, note: '' },
      { id: 4, campusDep: '10:25', jugongDep: '경유', onyangDep: '10:55', terminalDep: '11:00', campusArr: '11:20', friOff: false, note: '' },
      { id: 5, campusDep: '15:30', jugongDep: '경유', onyangDep: '16:00', terminalDep: '16:05', campusArr: '16:25', friOff: false, note: '' },
      { id: 6, campusDep: '17:30', jugongDep: '경유', onyangDep: '18:00', terminalDep: '18:05', campusArr: '18:25', friOff: false, note: '' },
      { id: 7, campusDep: '18:30', jugongDep: '경유', onyangDep: '19:00', terminalDep: '19:05', campusArr: '19:25', friOff: true, note: '금(X)' }
    ]
  }
];

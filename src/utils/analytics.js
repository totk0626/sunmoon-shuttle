/**
 * 선문 셔틀 비침습적 익명 방문자 통계 유틸리티
 * - 개인정보(IP, 위치, 브라우저 세부정보 등)는 일체 수집/저장하지 않습니다.
 * - 단말기 고유 랜덤 식별자(UUID)와 PWA(홈화면 바로가기) 여부, 접속 시각만 기록합니다.
 */

const SUPABASE_URL = 'https://uiqpkbugqkfkrhmswzag.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_oAaZpvP5_XrVxup8XBXbgw_HX3SUHGI';

// 익명 방문자 ID 가져오기 또는 생성 (localStorage)
function getOrCreateVisitorId() {
  const STORAGE_KEY = 'sunmoon_visitor_id';
  try {
    let vid = localStorage.getItem(STORAGE_KEY);
    if (!vid) {
      vid = typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : 'v_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
      localStorage.setItem(STORAGE_KEY, vid);
    }
    return vid;
  } catch {
    return 'anonymous_' + Math.random().toString(36).substring(2, 8);
  }
}

// 홈화면 추가(PWA / Standalone) 모드 여부 감지
function checkIsPwa() {
  try {
    const isStandaloneDisplay = window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;
    const isNavigatorStandalone = window.navigator && window.navigator.standalone === true;
    return Boolean(isStandaloneDisplay || isNavigatorStandalone);
  } catch {
    return false;
  }
}

/**
 * 접속 기록 전송 (Silent Ping)
 * - 새로고침 연타 방지: 마지막 전송 후 10분 이내 재방문은 중복 카운트하지 않음
 */
export function recordVisit() {
  if (typeof window === 'undefined') return;

  try {
    const now = Date.now();
    const LAST_PING_KEY = 'sunmoon_last_ping_ts';
    const lastPing = localStorage.getItem(LAST_PING_KEY);

    // 10분(600,000ms) 이내의 새로고침은 중복 기록 방지
    if (lastPing && now - Number(lastPing) < 10 * 60 * 1000) {
      return;
    }

    const visitorId = getOrCreateVisitorId();
    const isPwa = checkIsPwa();

    localStorage.setItem(LAST_PING_KEY, String(now));

    // Supabase REST API로 비동기 무음 전송
    fetch(`${SUPABASE_URL}/rest/v1/visitor_logs`, {
      method: 'POST',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        visitor_id: visitorId,
        is_pwa: isPwa,
        created_at: new Date().toISOString()
      })
    }).catch(() => {
      // 네트워크 에러나 차단 시에도 앱 동작에는 전혀 지장 없도록 무음 처리
    });
  } catch {
    // 무음 처리
  }
}

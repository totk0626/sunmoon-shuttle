/**
 * 선문 셔틀 접속 통계 조회 스크립트
 * 실행 방법: node scripts/check-stats.js
 */

const SUPABASE_URL = 'https://uiqpkbugqkfkrhmswzag.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_oAaZpvP5_XrVxup8XBXbgw_HX3SUHGI';

async function fetchStats() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/visitor_logs?select=id,created_at,visitor_id,is_pwa&order=created_at.desc`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });

    if (!res.ok) {
      console.error('데이터 조회 실패:', res.status, res.statusText);
      return;
    }

    const data = await res.json();
    console.log('\n📊 === [ 선문 셔틀 접속 통계 보고서 ] ===\n');

    if (data.length === 0) {
      console.log('아직 수집된 접속 기록이 없습니다.');
      return;
    }

    const now = new Date();
    // 한국 시간 기준 날짜 문자열 (YYYY-MM-DD)
    const getKstDateStr = (dateObj) => {
      return new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(dateObj);
    };

    const todayStr = getKstDateStr(now);

    // 날짜별 집계
    const dailyMap = {};
    let totalPwaHits = 0;
    const uniqueVisitorsAllTime = new Set();

    data.forEach(item => {
      const createdAt = new Date(item.created_at);
      const dateStr = getKstDateStr(createdAt);

      if (!dailyMap[dateStr]) {
        dailyMap[dateStr] = {
          totalHits: 0,
          uniqueVisitors: new Set(),
          pwaHits: 0
        };
      }

      dailyMap[dateStr].totalHits += 1;
      dailyMap[dateStr].uniqueVisitors.add(item.visitor_id);
      uniqueVisitorsAllTime.add(item.visitor_id);

      if (item.is_pwa) {
        dailyMap[dateStr].pwaHits += 1;
        totalPwaHits += 1;
      }
    });

    const todayStats = dailyMap[todayStr] || { totalHits: 0, uniqueVisitors: new Set(), pwaHits: 0 };
    const pwaRate = data.length > 0 ? Math.round((totalPwaHits / data.length) * 100) : 0;
    const todayPwaRate = todayStats.totalHits > 0 ? Math.round((todayStats.pwaHits / todayStats.totalHits) * 100) : 0;

    console.log(`📌 오늘 (${todayStr}) 실시간 현황:`);
    console.log(`   - 오늘 방문 학생 수 (DAU): ${todayStats.uniqueVisitors.size}명`);
    console.log(`   - 오늘 총 실행/조회 횟수:   ${todayStats.totalHits}회`);
    console.log(`   - 홈화면(PWA) 바로가기 실행: ${todayStats.pwaHits}회 (${todayPwaRate}%)\n`);

    console.log(`📈 전체 누적 현황:`);
    console.log(`   - 총 누적 고유 방문자:      ${uniqueVisitorsAllTime.size}명`);
    console.log(`   - 총 누적 실행 횟수:        ${data.length}회`);
    console.log(`   - 전체 홈화면(PWA) 비율:    ${pwaRate}%\n`);

    console.log(`📅 최근 일자별 추이:`);
    const sortedDates = Object.keys(dailyMap).sort().reverse().slice(0, 7);
    sortedDates.forEach(date => {
      const day = dailyMap[date];
      console.log(`   [${date}] 방문자: ${day.uniqueVisitors.size}명 | 총 실행: ${day.totalHits}회 | 홈화면: ${day.pwaHits}회`);
    });

    console.log('\n==========================================\n');
  } catch (err) {
    console.error('에러 발생:', err.message);
  }
}

fetchStats();

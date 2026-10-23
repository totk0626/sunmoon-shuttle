import React from 'react';
import { Bus, Clock, MapPin, ShieldCheck, AlertTriangle, Sliders, ArrowRight } from 'lucide-react';
import { getUpcomingBuses, formatRemainingTime, getDayInfo } from '../utils/timeUtils';

export default function NextShuttleCard({ selectedRoute, currentTime, directionFilter, onOpenSimulator }) {
  const upcomingList = getUpcomingBuses(selectedRoute, currentTime, directionFilter);
  const nextBus = upcomingList[0];
  const subsequentBuses = upcomingList.slice(1, 3);
  const dayInfo = getDayInfo(currentTime, selectedRoute);

  const secCountdown = Math.max(0, nextBus?.diffSecs ?? 0);

  const formatSecsToMinSec = (totalSeconds) => {
    if (totalSeconds <= 0) return '지금 출발!';

    if (totalSeconds >= 3600) {
      const hours = Math.floor(totalSeconds / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      const hStr = hours.toString().padStart(2, '0');
      const mStr = mins.toString().padStart(2, '0');
      const sStr = secs.toString().padStart(2, '0');
      return `${hStr}시간 ${mStr}분 ${sStr}초`;
    } else {
      const mins = Math.floor(totalSeconds / 60);
      const secs = totalSeconds % 60;
      const mStr = mins.toString().padStart(2, '0');
      const sStr = secs.toString().padStart(2, '0');
      return `${mStr}분 ${sStr}초`;
    }
  };

  const isUrgent = nextBus && nextBus.diffMins <= 3;
  const isSoon = nextBus && nextBus.diffMins <= 15;

  return (
    <div className="next-shuttle-widget-wrap">
      {dayInfo.isOutsideTerm || dayInfo.isNoService ? (
        <div className="end-service-widget">
          <AlertTriangle size={32} color="#f59e0b" style={{ margin: '0 auto 8px auto' }} />
          <div className="end-service-title">
            {dayInfo.isOutsideTerm ? '최신 시간표 확인 필요' : dayInfo.holidayRule ? `${dayInfo.holidayRule.name} 셔틀 미운행 🚫` : '셔틀버스 미운행 🚫'}
          </div>
          <div className="end-service-desc">
            {dayInfo.isOutsideTerm ? dayInfo.specialNotice : dayInfo.noServiceReason || '해당 날짜에는 셔틀버스가 운행하지 않습니다.'}
          </div>
          <button type="button" className="modal-reset-btn" onClick={onOpenSimulator} style={{ width: 'auto', display: 'inline-flex', padding: '8px 16px' }}>
            <Sliders size={14} /> 다른 날짜/시각 설정해보기
          </button>
        </div>
      ) : !nextBus ? (
        <div className="end-service-widget">
          <Clock size={32} color="#64748b" style={{ margin: '0 auto 8px auto' }} />
          <div className="end-service-title">오늘 운행 마감 🌙</div>
          <div className="end-service-desc">{selectedRoute.shortName || selectedRoute.name}의 오늘 차편이 모두 종료되었습니다.</div>
          <button type="button" className="modal-primary-btn" onClick={onOpenSimulator} style={{ width: 'auto', display: 'inline-flex', padding: '8px 18px', fontSize: '0.85rem' }}>
            <Sliders size={14} /> 다른 시각 설정해보기
          </button>
        </div>
      ) : (
        <div className={`hero-widget-card ${isUrgent ? 'urgent' : isSoon ? 'soon' : ''}`}>
          {/* Top Pill Bar */}
          <div className="widget-top-row">
            <div className="widget-route-pill">
              <Bus size={14} />
              <span>{selectedRoute.shortName || selectedRoute.name}</span>
            </div>

            <div className="widget-dest-pill">
              <MapPin size={12} />
              <span>{nextBus.depLocation}</span>
              {nextBus.destLocation && (
                <>
                  <ArrowRight size={11} style={{ margin: '0 2px' }} />
                  <strong>{nextBus.destLocation}</strong>
                </>
              )}
            </div>
          </div>

          {/* Countdown Main Display */}
          <div className="widget-timer-block">
            <div className="timer-sub-text">
              <span className={`live-pulse-dot ${isUrgent ? 'red-pulse' : ''}`}></span>
              <span>다음 셔틀버스 출발까지</span>
              {isUrgent && <span style={{ color: '#fca5a5', fontWeight: 900, marginLeft: 4 }}>⚡ 곧 출발</span>}
            </div>

            <div className="timer-big-num">
              {formatSecsToMinSec(secCountdown)}
            </div>

            {/* Time Info Row: 출발 → 도착 */}
            <div className="widget-time-badges-row">
              <div className="badge-time-box">
                {nextBus.depTimeStr} 출발
              </div>
              {nextBus.destTimeStr && (
                <>
                  <ArrowRight size={15} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                  <div className="badge-dest-box">
                    {nextBus.destTimeStr} {nextBus.destTimeLabel}
                  </div>
                </>
              )}
            </div>

            {nextBus.boardingNotice && <div className="friday-notice-strip"><MapPin size={12} /> {nextBus.boardingNotice}</div>}

            {dayInfo.specialNotice ? (
              <div className="friday-notice-strip" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)', color: '#2563eb' }}>
                <ShieldCheck size={12} /> {dayInfo.specialNotice}
              </div>
            ) : dayInfo.isFriday ? (
              <div className="friday-notice-strip">
                <ShieldCheck size={12} /> 금요일 미운행 차편 자동 제외 적용중
              </div>
            ) : null}
          </div>

          {/* Subsequent Next Trips Mini Grid */}
          {subsequentBuses.length > 0 && (
            <div className="next-trips-mini-grid">
              {subsequentBuses.map((bus, idx) => (
                <div key={idx} className="mini-trip-card">
                  <span className="mini-dep">{bus.depTimeStr} 출발</span>
                  <span className="mini-diff">{formatRemainingTime(bus.diffMins)}</span>
                  {directionFilter === 'to_school' && <span className="mini-location">{bus.depLocation} 출발</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

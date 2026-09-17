import React, { useState, useEffect } from 'react';
import { Bus, Clock, MapPin, Zap, ShieldCheck, AlertTriangle, Sliders, ArrowRight } from 'lucide-react';
import { getUpcomingBuses, formatRemainingTime, getDayInfo } from '../utils/timeUtils';

export default function NextShuttleCard({ selectedRoute, currentTime, directionFilter, onOpenSimulator }) {
  const [secCountdown, setSecCountdown] = useState(0);

  const upcomingList = getUpcomingBuses(selectedRoute, currentTime, directionFilter);
  const nextBus = upcomingList[0];
  const subsequentBuses = upcomingList.slice(1, 3);
  const dayInfo = getDayInfo(currentTime);

  useEffect(() => {
    if (!nextBus) return;
    const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();
    const currentSecs = currentTime.getSeconds();
    const remainingSecs = (nextBus.depMins - currentMins) * 60 - currentSecs;
    setSecCountdown(Math.max(0, remainingSecs));
  }, [currentTime, nextBus]);

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
      {dayInfo.isWeekend ? (
        <div className="end-service-widget">
          <AlertTriangle size={32} color="#f59e0b" style={{ margin: '0 auto 8px auto' }} />
          <div className="end-service-title">주말 / 공휴일 미운행 🚫</div>
          <div className="end-service-desc">주말에는 셔틀버스가 운행하지 않습니다.</div>
          <button type="button" className="modal-reset-btn" onClick={onOpenSimulator} style={{ width: 'auto', display: 'inline-flex', padding: '8px 16px' }}>
            <Sliders size={14} /> 시간 조절해보기
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

            {/* Time Info Badges */}
            <div className="widget-time-badges-row">
              <div className="badge-time-box">
                {nextBus.depLocation}: {nextBus.depTimeStr} 출발
              </div>
              {nextBus.destTimeStr && (
                <div className="badge-dest-box">
                  ➔ {nextBus.destLocation} ({nextBus.destTimeStr})
                </div>
              )}
            </div>

            {dayInfo.isFriday && (
              <div className="friday-notice-strip">
                <ShieldCheck size={12} /> 금요일 미운행 차편 자동 제외 적용중
              </div>
            )}
          </div>

          {/* Subsequent Next Trips Mini Grid */}
          {subsequentBuses.length > 0 && (
            <div className="next-trips-mini-grid">
              {subsequentBuses.map((bus, idx) => (
                <div key={idx} className="mini-trip-card">
                  <span className="mini-dep">{bus.depTimeStr} 출발</span>
                  <span className="mini-diff">{formatRemainingTime(bus.diffMins)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

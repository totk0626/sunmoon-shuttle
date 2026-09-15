import React from 'react';
import { Bus, Clock, Sliders, Info, Sun, Moon, RefreshCw } from 'lucide-react';
import { getDayInfo } from '../utils/timeUtils';

export default function Header({
  currentTime,
  isSimulated,
  onResetTime,
  onOpenSimulator,
  onOpenInfo,
  theme,
  onToggleTheme
}) {
  const dayInfo = getDayInfo(currentTime);

  const formatClock = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');
    const secs = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${mins}:${secs}`;
  };

  return (
    <header className="app-header">
      <div className="header-top container">
        <div className="brand-group">
          <div className="brand-icon">
            <Bus size={20} />
          </div>
          <div>
            <div className="brand-title">
              선문 셔틀 <span className="haedal-badge">🦦 해달이</span>
            </div>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="action-icon-btn"
            onClick={onToggleTheme}
            title={theme === 'light' ? '다크 모드로 변경' : '라이트 모드로 변경'}
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button
            type="button"
            className="action-icon-btn"
            onClick={onOpenInfo}
            title="학생 편의 정보 & 민원"
          >
            <Info size={16} />
          </button>
        </div>
      </div>

      <div className="header-status-bar container">
        <div className="time-display-group">
          <div className="time-display">
            <Clock size={14} className="clock-icon" />
            <span className="clock-time">{formatClock(currentTime)}</span>
            <span className={`day-badge ${dayInfo.isFriday ? 'friday' : dayInfo.isWeekend ? 'weekend' : 'weekday'}`}>
              {dayInfo.dayName}
            </span>
          </div>

          {/* Icon-only time adjust button right next to clock */}
          <button
            type="button"
            className={`action-icon-btn sim-icon-only-btn ${isSimulated ? 'active' : ''}`}
            onClick={onOpenSimulator}
            title="출발 시간 조절"
          >
            <Sliders size={15} />
          </button>

          {isSimulated && (
            <button type="button" className="reset-time-btn" onClick={onResetTime}>
              <RefreshCw size={11} /> 실제시간
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

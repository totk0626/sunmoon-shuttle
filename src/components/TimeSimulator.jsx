import React, { useState } from 'react';
import { X, Clock, Check, RotateCcw } from 'lucide-react';
import { getDayInfo } from '../utils/timeUtils';

export default function TimeSimulator({ isOpen, onClose, currentTime, onSetSimulatedTime, onResetTime, isSimulated }) {
  if (!isOpen) return null;

  const dayInfo = getDayInfo(currentTime);
  // Initialize state once on modal open
  const [hours, setHours] = useState(() => currentTime.getHours());
  const [minutes, setMinutes] = useState(() => currentTime.getMinutes());
  const [forceFriday, setForceFriday] = useState(() => dayInfo.isFriday);

  const handleApply = (e) => {
    if (e) e.preventDefault();
    const newDate = new Date();
    newDate.setHours(hours);
    newDate.setMinutes(minutes);
    newDate.setSeconds(0);

    // If user explicitly toggled Friday rule testing
    if (forceFriday) {
      const currentDay = newDate.getDay();
      const diffDays = 5 - currentDay; // 5 is Friday
      newDate.setDate(newDate.getDate() + diffDays);
    } else if (newDate.getDay() === 5) {
      // If today is Friday but user turned off Friday rule, set to Monday
      newDate.setDate(newDate.getDate() - 4);
    }

    onSetSimulatedTime(newDate);
    onClose();
  };

  const handleQuickPreset = (h, m) => {
    setHours(h);
    setMinutes(m);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet-clean" onClick={(e) => e.stopPropagation()}>
        <div className="modal-sheet-header">
          <div className="modal-sheet-title">
            <Clock size={20} color="var(--primary)" />
            <span>출발 시간 조절</span>
          </div>
          <button type="button" className="modal-close-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Clock Picker Box (Vertical Wheel Select) */}
        <div className="sheet-section-title">
          <Clock size={13} /> 출발 시간 설정 (시/분 선택)
        </div>
        <div className="clock-picker-box">
          <div className="picker-col">
            <span className="picker-col-label">시간 (시)</span>
            <select
              className="picker-wheel-select"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value, 10))}
            >
              {Array.from({ length: 24 }, (_, i) => i).map(h => (
                <option key={h} value={h}>
                  {h.toString().padStart(2, '0')}시
                </option>
              ))}
            </select>
          </div>

          <span className="picker-colon">:</span>

          <div className="picker-col">
            <span className="picker-col-label">분 (분)</span>
            <select
              className="picker-wheel-select"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value, 10))}
            >
              {Array.from({ length: 60 }, (_, i) => i).map(m => (
                <option key={m} value={m}>
                  {m.toString().padStart(2, '0')}분
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Friday Toggle Option */}
        <button
          type="button"
          className={`friday-check-btn ${forceFriday ? 'active' : ''}`}
          onClick={() => setForceFriday(!forceFriday)}
        >
          <span>금요일 미운행 차편 자동 제외 {forceFriday ? '☑ 적용중' : '☐ 미적용'}</span>
        </button>

        {/* Quick Preset Time Grid */}
        <div className="sheet-section-title">빠른 시간 선택</div>
        <div className="quick-time-grid">
          <button type="button" className="quick-time-chip" onClick={() => handleQuickPreset(8, 0)}>
            08:00
          </button>
          <button type="button" className="quick-time-chip" onClick={() => handleQuickPreset(13, 30)}>
            13:30
          </button>
          <button type="button" className="quick-time-chip" onClick={() => handleQuickPreset(17, 30)}>
            17:30
          </button>
          <button type="button" className="quick-time-chip" onClick={() => handleQuickPreset(21, 10)}>
            21:10
          </button>
        </div>

        {/* Action Buttons */}
        <button
          type="button"
          className="modal-primary-btn"
          onClick={handleApply}
        >
          <Check size={18} /> 출발 시간 적용하기
        </button>

        {isSimulated && (
          <button
            type="button"
            className="modal-reset-btn"
            onClick={() => {
              onResetTime();
              onClose();
            }}
          >
            <RotateCcw size={14} /> 실제 시간으로 복원
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { X, Clock, Calendar, Check, RotateCcw } from 'lucide-react';
import { getScheduleInfo } from '../utils/timeUtils';

const WEEKDAYS = [
  { label: '월', day: 1 },
  { label: '화', day: 2 },
  { label: '수', day: 3 },
  { label: '목', day: 4 },
  { label: '금', day: 5 },
  { label: '토', day: 6 },
  { label: '일', day: 0 }
];

export default function TimeSimulator({ onClose, currentTime, onSetSimulatedTime, onResetTime, isSimulated }) {
  // Initialize state with currentTime
  const [selectedDate, setSelectedDate] = useState(() => new Date(currentTime));
  const [hours, setHours] = useState(() => currentTime.getHours());
  const [minutes, setMinutes] = useState(() => currentTime.getMinutes());

  // Current simulation preview info
  const previewDate = new Date(selectedDate);
  previewDate.setHours(hours);
  previewDate.setMinutes(minutes);
  previewDate.setSeconds(0);
  const previewInfo = getScheduleInfo(previewDate);

  const handleSelectDayOfWeek = (targetDay) => {
    const nextDate = new Date(selectedDate);
    const currentDay = nextDate.getDay();
    const diff = targetDay - currentDay;
    nextDate.setDate(nextDate.getDate() + diff);

    // 요일 선택 시 추석 등 특수 연휴에 걸릴 경우, 사용자가 해당 요일의 정상 시간표를 바로 볼 수 있도록 평시 주간으로 자동 이동
    const info = getScheduleInfo(nextDate);
    if (info.isNoService && info.holidayRule) {
      nextDate.setDate(nextDate.getDate() - 7);
      const prevCheck = getScheduleInfo(nextDate);
      if (prevCheck.isNoService && prevCheck.holidayRule) {
        nextDate.setDate(nextDate.getDate() + 14);
      }
    }

    setSelectedDate(nextDate);
  };

  const handleQuickPreset = (h, m) => {
    setHours(h);
    setMinutes(m);
  };

  const handleApply = (e) => {
    if (e) e.preventDefault();
    const finalDate = new Date(selectedDate);
    finalDate.setHours(hours);
    finalDate.setMinutes(minutes);
    finalDate.setSeconds(0);

    onSetSimulatedTime(finalDate);
    onClose();
  };

  const currentDayOfWeek = selectedDate.getDay();

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-sheet-clean" onClick={(e) => e.stopPropagation()}>
        <div className="modal-sheet-header">
          <div className="modal-sheet-title">
            <Clock size={20} color="var(--primary)" />
            <span>출발 요일 및 시간 조절</span>
          </div>
          <button type="button" className="modal-close-icon" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Selected Date & Status Preview Banner */}
        <div className="simulator-status-banner">
          <div className="banner-date-text">
            <Calendar size={14} style={{ color: 'var(--primary)' }} />
            <span>
              {previewInfo.dayName} {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')} 기준
            </span>
          </div>
          <div className={`banner-badge ${previewInfo.isNoService ? 'no-service' : previewInfo.isWeekend ? 'weekend' : 'normal'}`}>
            {previewInfo.isOutsideTerm ? (
              <>시간표 확인 필요</>
            ) : previewInfo.isNoService ? (
              <>🚫 {previewInfo.holidayRule ? previewInfo.holidayRule.name : '미운행'}</>
            ) : previewInfo.specialNotice ? (
              <>✨ {previewInfo.badgeText}</>
            ) : previewInfo.isSaturday ? (
              <>토요일 시간표</>
            ) : previewInfo.isSunday ? (
              <>일요일 시간표</>
            ) : previewInfo.isFriday ? (
              <>금요일 (금X 제외)</>
            ) : (
              <>평일 시간표</>
            )}
          </div>
        </div>

        {/* 1. Day of the Week Selector (월~일) */}
        {previewInfo.isOutsideTerm && <p role="status">{previewInfo.specialNotice}</p>}
        <div className="sheet-section-title">
          <Calendar size={13} /> 요일 선택
        </div>
        <div className="weekday-selector-grid">
          {WEEKDAYS.map(w => {
            const isSelected = currentDayOfWeek === w.day;
            const isWeekendDay = w.day === 0 || w.day === 6;
            return (
              <button
                key={w.day}
                type="button"
                className={`weekday-chip ${isSelected ? 'active' : ''} ${isWeekendDay ? 'weekend' : ''}`}
                onClick={() => handleSelectDayOfWeek(w.day)}
              >
                <span className="weekday-chip-name">{w.label}</span>
              </button>
            );
          })}
        </div>

        {/* 2. Clock Picker Box (Vertical Wheel Select) */}
        <div className="sheet-section-title" style={{ marginTop: '16px' }}>
          <Clock size={13} /> 출발 시간 설정 (시/분)
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

        {/* Quick Preset Time Grid */}
        <div className="sheet-section-title" style={{ marginTop: '14px' }}>
          빠른 시간 선택
        </div>
        <div className="quick-time-grid">
          <button type="button" className="quick-time-chip" onClick={() => handleQuickPreset(8, 0)}>
            08:00
          </button>
          <button type="button" className="quick-time-chip" onClick={() => handleQuickPreset(12, 0)}>
            12:00
          </button>
          <button type="button" className="quick-time-chip" onClick={() => handleQuickPreset(16, 0)}>
            16:00
          </button>
          <button type="button" className="quick-time-chip" onClick={() => handleQuickPreset(18, 20)}>
            18:20
          </button>
        </div>

        {/* Action Buttons */}
        <button
          type="button"
          className="modal-primary-btn"
          onClick={handleApply}
          style={{ marginTop: '16px' }}
        >
          <Check size={18} /> 설정된 요일/시간 적용하기
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
            <RotateCcw size={14} /> 실제 현재 시간으로 복원
          </button>
        )}
      </div>
    </div>
  );
}

import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, EyeOff, Calendar, ShieldCheck, MapPin } from 'lucide-react';
import { timeStringToMinutes, getDayInfo, isStudentCouncilTime } from '../utils/timeUtils';

export default function TimetableList({ route, currentTime }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hidePassed, setHidePassed] = useState(true);

  const dayInfo = getDayInfo(currentTime);
  const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();

  if (!route || !route.schedule) return null;

  // Rule 1: Exclude friOff trips completely on Fridays
  let list = route.schedule;
  if (dayInfo.isFriday) {
    list = list.filter(item => !item.friOff);
  }

  let processedList = list.map(item => {
    const depTimeStr = item.campusDep || item.asanDep || item.cheonanDep || item.terminalDep || item.onyangDep;
    const depMins = timeStringToMinutes(depTimeStr);

    let isPassed = false;
    let diffMins = null;

    if (depMins !== null) {
      diffMins = depMins - currentMins;
      if (diffMins < 0) isPassed = true;
    }

    // Rule 3: Identify if this trip stops by Student Council Building (학생회관 승강장 경유)
    const isStudentHall = item.campusDep && isStudentCouncilTime(item.campusDep);

    return {
      ...item,
      depTimeStr,
      depMins,
      diffMins,
      isPassed,
      isStudentHall
    };
  });

  // Mark the single next upcoming trip
  let foundNext = false;
  processedList = processedList.map(item => {
    if (!foundNext && item.diffMins !== null && item.diffMins >= 0) {
      foundNext = true;
      return { ...item, isNext: true };
    }
    return item;
  });

  const validCount = processedList.length;
  const remainingCount = processedList.filter(i => i.diffMins !== null && i.diffMins >= 0).length;

  // Filter based on hidePassed state
  const displayedList = processedList.filter(item => {
    if (hidePassed && item.isPassed && !item.isNext) return false;
    return true;
  });

  return (
    <div className="timetable-accordion-container">
      <button
        type="button"
        className="timetable-accordion-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="acc-title-group">
          <Calendar size={18} color="var(--primary)" />
          <span>전체 시간표</span>
          <span className="acc-count-pill">남은 차편 {remainingCount}/{validCount}회</span>
          {dayInfo.isFriday && (
            <span className="fri-excluded-badge">
              <ShieldCheck size={11} /> 금(X) 차편 제외됨
            </span>
          )}
        </div>

        <div className="acc-arrow-badge">
          <span>{isExpanded ? '시간표 접기' : '전체 보기'}</span>
          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {isExpanded && (
        <div className="timetable-accordion-body">
          {/* Boarding Location Legend & Filter Bar */}
          <div className="timetable-legend-row">
            <div className="boarding-legend-group">
              <span className="legend-chip legend-student-hall">
                <MapPin size={11} /> 학생회관 경유 (13:30~15:30 / 19:30~막차)
              </span>
            </div>

            <button
              type="button"
              className={`passed-toggle-btn ${hidePassed ? 'active' : ''}`}
              onClick={() => setHidePassed(!hidePassed)}
            >
              {hidePassed ? <EyeOff size={13} /> : <Eye size={13} />}
              <span>{hidePassed ? '지나간 차편 숨김 중' : '지나간 차편 포함해서 보기'}</span>
            </button>
          </div>

          <div className="timetable-scroll-wrapper">
            <table className="timetable-table">
              <thead>
                <tr>
                  <th style={{ width: '38px' }}>순번</th>
                  {route.stops.map(stop => (
                    <th key={stop.id}>{stop.name}</th>
                  ))}
                  <th style={{ width: '100px' }}>승강장 / 특이사항</th>
                </tr>
              </thead>
              <tbody>
                {displayedList.length === 0 ? (
                  <tr>
                    <td colSpan={route.stops.length + 2} style={{ padding: '16px', color: 'var(--text-muted)' }}>
                      지나간 차편이 숨겨져 있습니다. [지나간 차편 포함]을 누르면 확인할 수 있습니다.
                    </td>
                  </tr>
                ) : (
                  displayedList.map(item => {
                    const rowClasses = [
                      item.isNext ? 'row-next-highlight' : '',
                      item.isStudentHall ? 'row-student-hall' : '',
                      item.isPassed && !item.isNext ? 'row-passed' : ''
                    ].filter(Boolean).join(' ');

                    return (
                      <tr key={item.id} className={rowClasses}>
                        <td className="seq-num">#{item.id}</td>

                        {route.id === 'cheonan_asan_tangjeong' && (
                          <>
                            <td className="time-cell">{item.campusDep || '-'}</td>
                            <td className="time-cell">{item.asanDep || '-'}</td>
                            <td className="time-cell">{item.campusArr || '-'}</td>
                          </>
                        )}

                        {route.id === 'cheonan_station' && (
                          <>
                            <td className="time-cell">{item.campusDep || '-'}</td>
                            <td className="time-cell">{item.cheonanDep || '-'}</td>
                            <td className="time-cell">{item.campusArr || '-'}</td>
                          </>
                        )}

                        {route.id === 'cheonan_terminal' && (
                          <>
                            <td className="time-cell">{item.campusDep || '-'}</td>
                            <td className="time-cell">{item.terminalDep || '-'}</td>
                            <td className="time-cell">{item.campusArr || '-'}</td>
                          </>
                        )}

                        {route.id === 'onyang_asan' && (
                          <>
                            <td className="time-cell">{item.campusDep || '-'}</td>
                            <td className="time-cell">{item.jugongDep || '-'}</td>
                            <td className="time-cell">{item.onyangDep || '-'}</td>
                            <td className="time-cell">{item.terminalDep || '-'}</td>
                            <td className="time-cell">{item.campusArr || '-'}</td>
                          </>
                        )}

                        <td>
                          {item.isNext ? (
                            <span className="note-badge badge-next">다음 차편</span>
                          ) : item.isStudentHall ? (
                            <span className="note-badge badge-student-hall">🏛️ 학생회관 경유</span>
                          ) : item.note ? (
                            <span className="note-badge" style={{ backgroundColor: 'var(--bg-subtle)', color: 'var(--text-sub)' }}>{item.note}</span>
                          ) : (
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>-</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

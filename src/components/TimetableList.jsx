import React, { useState } from 'react';
import { ChevronDown, Eye, EyeOff, Calendar, MapPin } from 'lucide-react';
import { timeStringToMinutes, getDayInfo, isStudentCouncilTime, getStationStop } from '../utils/timeUtils';

export default function TimetableList({ route, currentTime, directionFilter = 'to_school' }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hidePassed, setHidePassed] = useState(true);

  const dayInfo = getDayInfo(currentTime, route);
  const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();

  if (!route) return null;

  // Rule: Use activeSchedule determined by day and holiday rules
  let list = dayInfo.activeSchedule || [];

  // Calculate passed status based on the SELECTED DIRECTION
  // 등교 (to_school): 역/터미널 출발 시각 기준!
  // 하교 (to_station): 아산캠퍼스 출발 시각 기준!
  let processedList = list.map(item => {
    let relevantDepTimeStr = null;

    if (directionFilter === 'to_school') {
      relevantDepTimeStr = getStationStop(route, item).time;
    } else {
      relevantDepTimeStr = item.campusDep;
    }

    const depMins = timeStringToMinutes(relevantDepTimeStr);

    let isPassed = false;
    let diffMins = null;

    if (!relevantDepTimeStr) {
      // 해당 방향(등교/하교)으로 운행하지 않는 차편
      isPassed = true;
    } else if (depMins !== null) {
      diffMins = depMins - currentMins;
      isPassed = diffMins * 60 - currentTime.getSeconds() < -20;
    }

    // Identify if this trip stops by Student Council Building (학생회관 승강장 경유)
    // 주말에는 학생회관 경유 없음 (학기 중 평일만)
    const isStudentHall = ['weekday', 'friday'].includes(dayInfo.scheduleType) && item.campusDep && isStudentCouncilTime(item.campusDep);

    return {
      ...item,
      relevantDepTimeStr,
      depMins,
      diffMins,
      isPassed,
      isStudentHall
    };
  });

  // Mark the single next upcoming trip FOR THE CURRENT DIRECTION
  const nextIndex = processedList.findIndex(item => item.diffMins !== null && !item.isPassed);
  processedList = processedList.map((item, index) => ({ ...item, isNext: index === nextIndex }));

  const validCount = processedList.filter(i => i.relevantDepTimeStr !== null).length;
  const remainingCount = processedList.filter(i => i.diffMins !== null && !i.isPassed).length;

  // Filter based on hidePassed state
  const displayedList = processedList.filter(item => {
    if (hidePassed && item.isPassed && !item.isNext) return false;
    return true;
  });

  const isToSchool = directionFilter === 'to_school';

  const shortDayName = dayInfo.scheduleType === 'sunday' ? '일' : (dayInfo.dayName ? dayInfo.dayName.charAt(0) : '');

  return (
    <div className="timetable-accordion-container">
      <button
        type="button"
        className="timetable-accordion-btn"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="acc-title-group">
          <Calendar size={18} color="var(--primary)" />
          <span>전체 시간표 ({shortDayName})</span>
          {!dayInfo.isOutsideTerm && !dayInfo.isNoService && (
            <span className="acc-count-pill">
              {isToSchool ? '등교' : '하교'} 남은 차편 {remainingCount}/{validCount}회
            </span>
          )}
        </div>

        <div className="acc-arrow-badge">
          <span>{isExpanded ? '시간표 접기' : '전체 보기'}</span>
          <ChevronDown size={18} className={`acc-arrow-icon ${isExpanded ? 'rotated' : ''}`} />
        </div>
      </button>

      <div className={`timetable-accordion-wrapper ${isExpanded ? 'expanded' : ''}`}>
        <div className="timetable-accordion-body">
          {dayInfo.isOutsideTerm || dayInfo.isNoService ? (
            <div style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>🚫</div>
              <strong style={{ color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                {dayInfo.isOutsideTerm ? '최신 시간표 확인 필요' : dayInfo.holidayRule ? `${dayInfo.holidayRule.name} 셔틀버스 운행 없음` : '운행 없음'}
              </strong>
              <span style={{ fontSize: '0.85rem' }}>{dayInfo.isOutsideTerm ? dayInfo.specialNotice : dayInfo.noServiceReason}</span>
            </div>
          ) : (
            <>
              {/* Boarding Location Legend & Filter Bar */}
              <div className="timetable-legend-row">
                <div className="boarding-legend-group">
                  {['weekday', 'friday'].includes(dayInfo.scheduleType) ? (
                    <span className="legend-chip legend-student-hall">
                      <MapPin size={11} /> 학생회관 경유 (13:30~15:30 / 19:30~막차)
                    </span>
                  ) : route.id === 'cheonan_asan_tangjeong' ? (
                    <span className="legend-chip" style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }}>
                      <MapPin size={11} /> 하교방향 전체 탕정역 경유
                    </span>
                  ) : null}
                </div>

                <button
                  type="button"
                  className={`passed-toggle-btn ${hidePassed ? 'active' : ''}`}
                  onClick={() => setHidePassed(!hidePassed)}
                >
                  {hidePassed ? <EyeOff size={13} /> : <Eye size={13} />}
                  <span>{hidePassed ? '지나간 차편 숨김 중' : '지나간 차편 포함'}</span>
                </button>
              </div>

              {/* Direction-specific Guidance Banner */}
          <div style={{
            fontSize: '0.74rem',
            padding: '5px 10px',
            marginBottom: '6px',
            borderRadius: '6px',
            backgroundColor: 'var(--bg-card)',
            color: 'var(--text-sub)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            flexWrap: 'nowrap'
          }}>
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              현재 <strong>{isToSchool ? '등교' : '하교'}</strong> 기준 시간표
            </span>
            <span style={{ color: 'var(--accent-green)', fontWeight: 800, whiteSpace: 'nowrap', flexShrink: 0 }}>📍 승차 시간 기준</span>
          </div>

          {/* Isolated Scroll Box for Table (No Horizontal Scroll Needed!) */}
          <div className="timetable-scroll-box">
            <table className="timetable-table">
              <thead>
                {route.id === 'cheonan_asan_tangjeong' && (
                  <tr>
                    <th style={{ width: '30px' }}>순번</th>
                    <th className={!isToSchool ? 'th-boarding' : ''}>
                      아산캠
                    </th>
                    <th className={isToSchool ? 'th-boarding' : ''}>
                      천안아산역
                    </th>
                    <th>도착</th>
                    <th style={{ width: '85px' }}>특이사항</th>
                  </tr>
                )}
                {route.id === 'cheonan_station' && (
                  <tr>
                    <th style={{ width: '30px' }}>순번</th>
                    <th className={!isToSchool ? 'th-boarding' : ''}>
                      아산캠
                    </th>
                    <th className={isToSchool ? 'th-boarding' : ''}>
                      천안역
                    </th>
                    <th>도착</th>
                    <th style={{ width: '85px' }}>특이사항</th>
                  </tr>
                )}
                {route.id === 'cheonan_terminal' && (
                  <tr>
                    <th style={{ width: '30px' }}>순번</th>
                    <th className={!isToSchool ? 'th-boarding' : ''}>
                      아산캠
                    </th>
                    <th className={isToSchool ? 'th-boarding' : ''}>
                      터미널
                    </th>
                    <th>도착</th>
                    <th style={{ width: '85px' }}>특이사항</th>
                  </tr>
                )}
                {route.id === 'onyang_asan' && (
                  <tr>
                    <th style={{ width: '26px' }}>순번</th>
                    <th className={!isToSchool ? 'th-boarding' : ''}>
                      아산캠
                    </th>
                    <th>주공</th>
                    <th className={isToSchool ? 'th-boarding' : ''}>
                      온양역
                    </th>
                    <th>터미널</th>
                    <th>도착</th>
                    <th style={{ width: '70px' }}>비고</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {displayedList.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '16px', color: 'var(--text-muted)' }}>
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
                            <td className={`time-cell ${!isToSchool ? 'cell-active-dep' : ''}`}>
                              {item.campusDep || '-'}
                            </td>
                            <td className={`time-cell ${isToSchool ? 'cell-active-dep' : ''}`}>
                              {item.asanDep || '-'}
                            </td>
                            <td className="time-cell">{item.campusArr || '-'}</td>
                          </>
                        )}

                        {route.id === 'cheonan_station' && (
                          <>
                            <td className={`time-cell ${!isToSchool ? 'cell-active-dep' : ''}`}>
                              {item.campusDep || '-'}
                            </td>
                            <td className={`time-cell ${isToSchool ? 'cell-active-dep' : ''}`}>
                              {item.cheonanDep || '-'}
                              {item.boardingLocation && <small style={{ display: 'block' }}>{item.boardingLocation} 출발</small>}
                            </td>
                            <td className="time-cell">{item.campusArr || '-'}</td>
                          </>
                        )}

                        {route.id === 'cheonan_terminal' && (
                          <>
                            <td className={`time-cell ${!isToSchool ? 'cell-active-dep' : ''}`}>
                              {item.campusDep || '-'}
                            </td>
                            <td className={`time-cell ${isToSchool ? 'cell-active-dep' : ''}`}>
                              {item.terminalDep || '-'}
                              {item.boardingLocation && <small style={{ display: 'block' }}>{item.boardingLocation} 출발</small>}
                            </td>
                            <td className="time-cell">{item.campusArr || '-'}</td>
                          </>
                        )}

                        {route.id === 'onyang_asan' && (
                          <>
                            <td className={`time-cell ${!isToSchool ? 'cell-active-dep' : ''}`}>
                              {item.campusDep || '-'}
                            </td>
                            <td className="time-cell">{item.jugongDep || '-'}</td>
                            <td className={`time-cell ${isToSchool ? 'cell-active-dep' : ''}`}>
                              {item.onyangDep || '-'}
                            </td>
                            <td className="time-cell">{item.terminalDep || '-'}</td>
                            <td className="time-cell">{item.campusArr || '-'}</td>
                          </>
                        )}

                        <td>
                          {item.isStudentHall ? (
                            <span className="note-badge badge-student-hall">🏛️ 학생회관</span>
                          ) : item.note ? (
                            <span className="note-badge" style={{ backgroundColor: 'var(--bg-card)', color: 'var(--text-sub)', border: '1px solid var(--border-color)' }}>
                              {item.note}
                            </span>
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
          </>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * timeUtils.js - 셔틀버스 시간 계산 및 필터링 유틸리티
 */

export function timeStringToMinutes(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') return null;
  const match = timeStr.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  const hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  return hours * 60 + minutes;
}

export function minutesToTimeString(totalMinutes) {
  if (totalMinutes === null || totalMinutes === undefined) return '';
  const hours = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;
  const hStr = hours < 10 ? `0${hours}` : `${hours}`;
  const mStr = mins < 10 ? `0${mins}` : `${mins}`;
  return `${hStr}:${mStr}`;
}

export function getDayInfo(dateObj) {
  const day = dateObj.getDay();
  const daysKR = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  return {
    dayName: daysKR[day],
    isFriday: day === 5,
    isWeekend: day === 0 || day === 6
  };
}

export function isStudentCouncilTime(timeStr) {
  const mins = timeStringToMinutes(timeStr);
  if (mins === null) return false;
  const range1Start = 13 * 60 + 30; // 13:30
  const range1End = 15 * 60 + 30;   // 15:30
  const range2Start = 19 * 60 + 30; // 19:30
  return (mins >= range1Start && mins <= range1End) || mins >= range2Start;
}

export function getBoardingStopLocation(dateObj) {
  const currentMins = dateObj.getHours() * 60 + dateObj.getMinutes();
  const range1Start = 13 * 60 + 30; // 13:30
  const range1End = 15 * 60 + 30;   // 15:30
  const range2Start = 19 * 60 + 30; // 19:30

  if ((currentMins >= range1Start && currentMins <= range1End) || currentMins >= range2Start) {
    return {
      locationName: '학생회관 경유',
      badgeColor: '#ea580c',
      description: '현재 시간대는 공대 출발 후 학생회관 승강장을 경유합니다.'
    };
  }
  return {
    locationName: '공대 승강장',
    badgeColor: '#4b5563',
    description: '현재 시간대는 공대 승강장에서 승차합니다.'
  };
}

export function getUpcomingBuses(route, dateObj, directionFilter = 'to_school') {
  if (!route || !route.schedule) return [];

  const { isFriday } = getDayInfo(dateObj);
  const currentMins = dateObj.getHours() * 60 + dateObj.getMinutes();
  const currentSecs = dateObj.getHours() * 3600 + dateObj.getMinutes() * 60 + dateObj.getSeconds();

  // Friday filter: exclude friOff buses completely on Friday
  const validTrips = route.schedule.filter(item => {
    if (isFriday && item.friOff) return false;
    return true;
  });

  const processed = [];

  validTrips.forEach(item => {
    let depTimeStr = null;
    let depLocation = '아산캠';
    let destTimeStr = null;
    let destLocation = '아산캠';

    if (directionFilter === 'to_school') {
      // 등교 (캠퍼스행): 출발지는 역/터미널 출발 시각
      if (route.id === 'onyang_asan') {
        depTimeStr = item.onyangDep || item.terminalDep || item.jugongDep;
        depLocation = '온양온천역';
      } else {
        depTimeStr = item.asanDep || item.cheonanDep || item.terminalDep || item.onyangDep;
        depLocation = route.stops[1]?.name.replace(' 출발', '') || '역/터미널';
      }
      destTimeStr = item.campusArr;
      destLocation = '아산캠';
    } else {
      // 하교 (캠퍼스 출발): 출발지는 아산캠퍼스 출발 시각
      depTimeStr = item.campusDep;
      const isHall = depTimeStr && isStudentCouncilTime(depTimeStr);
      depLocation = '아산캠';

      destTimeStr = item.asanDep || item.cheonanDep || item.terminalDep || item.onyangDep || item.campusArr;
      destLocation = route.stops[1]?.name.replace(' 출발', '') || '역/터미널';
    }

    if (!depTimeStr) return;

    const depMins = timeStringToMinutes(depTimeStr);
    if (depMins === null) return;

    const depSecs = depMins * 60;
    const diffSecs = depSecs - currentSecs;
    const diffMins = depMins - currentMins;

    // 출발 시각 기준 20초 유예 - 출발 후 20초 지나야 "지나간 차편"으로 처리
    const GRACE_SECS = 20;
    const isPassed = diffSecs < -GRACE_SECS;

    processed.push({
      ...item,
      depTimeStr,
      depLocation,
      destTimeStr,
      destLocation,
      depMins,
      diffMins,
      diffSecs,
      isPassed
    });
  });

  const upcoming = processed
    .filter(item => !item.isPassed)
    .sort((a, b) => a.depMins - b.depMins);

  return upcoming;
}

export function formatRemainingTime(diffMins) {
  if (diffMins < 0) return '출발 완료';
  if (diffMins === 0) return '지금 출발!';
  return `${diffMins}분 후 출발`;
}

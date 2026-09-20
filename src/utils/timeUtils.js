import { SPECIAL_SCHEDULE_RULES_2026 } from '../data/shuttleData';

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


export function formatDateKey(dateObj) {
  const y = dateObj.getFullYear();
  const m = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const d = dateObj.getDate().toString().padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getScheduleInfo(dateObj, route = null) {
  const dateKey = formatDateKey(dateObj);
  const day = dateObj.getDay();
  const daysKR = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const dayName = daysKR[day];

  // 1. 공휴일 및 특별 운행 규칙 확인
  const matchedRule = SPECIAL_SCHEDULE_RULES_2026.find(rule => {
    return dateKey >= rule.startDate && dateKey <= rule.endDate;
  });

  let scheduleType = 'weekday'; // 'weekday' | 'friday' | 'saturday' | 'sunday' | 'none'
  let isNoService = false;
  let noServiceReason = '';
  let badgeText = dayName;
  let specialNotice = '';

  if (matchedRule) {
    if (matchedRule.type === 'no_service') {
      scheduleType = 'none';
      isNoService = true;
      noServiceReason = matchedRule.message;
      badgeText = matchedRule.badgeText || matchedRule.name;
      specialNotice = matchedRule.message;
    } else if (matchedRule.type === 'sunday_schedule') {
      scheduleType = 'sunday';
      badgeText = matchedRule.badgeText || '대체휴일(일요운행)';
      specialNotice = matchedRule.message;
    }
  } else {
    // 일반 요일 판정
    if (day === 0) {
      scheduleType = 'sunday';
      badgeText = '일요일';
    } else if (day === 6) {
      scheduleType = 'saturday';
      badgeText = '토요일';
    } else if (day === 5) {
      scheduleType = 'friday';
      badgeText = '금요일';
    } else {
      scheduleType = 'weekday';
      badgeText = dayName;
    }
  }

  // 2. 노선별 특수 조건 (온양/아산 노선은 주말 미운행)
  if (route && route.id === 'onyang_asan' && (scheduleType === 'saturday' || scheduleType === 'sunday')) {
    isNoService = true;
    noServiceReason = '온양/아산 노선은 주말(토/일) 및 공휴일에 운행하지 않습니다.';
  }

  // 3. 해당 조건의 실제 운행 스케줄 리스트 가져오기
  let activeSchedule = [];
  if (!isNoService && route) {
    if (scheduleType === 'saturday') {
      activeSchedule = route.saturdaySchedule || [];
    } else if (scheduleType === 'sunday') {
      activeSchedule = route.sundaySchedule || [];
    } else if (scheduleType === 'friday') {
      activeSchedule = (route.schedule || []).filter(item => !item.friOff);
    } else if (scheduleType === 'weekday') {
      activeSchedule = route.schedule || [];
    }
  }

  return {
    dateKey,
    day,
    dayName,
    scheduleType,
    isNoService,
    noServiceReason,
    badgeText,
    specialNotice,
    isFriday: scheduleType === 'friday',
    isSaturday: scheduleType === 'saturday',
    isSunday: scheduleType === 'sunday',
    isWeekend: day === 0 || day === 6,
    activeSchedule,
    holidayRule: matchedRule || null
  };
}

export function getDayInfo(dateObj, route = null) {
  return getScheduleInfo(dateObj, route);
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
  if (!route) return [];

  const scheduleInfo = getScheduleInfo(dateObj, route);
  if (scheduleInfo.isNoService) return [];

  const currentMins = dateObj.getHours() * 60 + dateObj.getMinutes();
  const currentSecs = dateObj.getHours() * 3600 + dateObj.getMinutes() * 60 + dateObj.getSeconds();

  const validTrips = scheduleInfo.activeSchedule;


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
  if (diffMins < 120) return `${diffMins}분 후 출발`;
  const hours = Math.floor(diffMins / 60);
  const mins = diffMins % 60;
  return mins > 0 ? `${hours}시간 ${mins}분 후 출발` : `${hours}시간 후 출발`;
}

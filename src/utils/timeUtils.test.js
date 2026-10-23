import test from 'node:test';
import assert from 'node:assert/strict';
import { ROUTES } from '../data/shuttleData.js';
import { getScheduleInfo, getUpcomingBuses } from './timeUtils.js';

const route = id => ROUTES.find(item => item.id === id);
const next = (id, date, direction = 'to_school') => getUpcomingBuses(route(id), new Date(date), direction)[0];

test('중간 출발 차량과 같은 시각의 일반 차량을 구분한다', () => {
  const trips = getUpcomingBuses(route('cheonan_station'), new Date('2026-10-26T08:49:00'));
  assert.equal(trips[0].depLocation, '하이렉스파');
  assert.equal(trips[0].depTimeStr, '08:50');
  assert.equal(trips[0].destTimeStr, '09:05');
  assert.equal(trips[1].depLocation, '천안역');
  assert.equal(trips[1].depTimeStr, '08:50');
  assert.equal(next('cheonan_terminal', '2026-10-26T08:54:00').depLocation, '두정동 맥도날드');
  assert.equal(next('cheonan_station', '2026-10-26T08:49:00', 'to_station').depTimeStr, '09:30');
});

test('온양 노선은 등교와 하교 모두 같은 정류장의 이름과 시간을 연결한다', () => {
  const inbound = next('onyang_asan', '2026-10-26T10:00:00');
  assert.deepEqual([inbound.depLocation, inbound.depTimeStr, inbound.destTimeStr], ['온양온천역', '10:55', '11:20']);
  const outbound = next('onyang_asan', '2026-10-26T10:00:00', 'to_station');
  assert.deepEqual([outbound.depTimeStr, outbound.destLocation, outbound.destTimeStr], ['10:25', '온양온천역', '10:55']);
  assert.equal(outbound.destTimeLabel, '정류장 출발 기준');
});

test('학기 경계는 포함하고 기간 밖은 미운행으로 단정하지 않는다', () => {
  for (const date of ['2026-09-01', '2026-12-14']) {
    assert.ok(getScheduleInfo(new Date(`${date}T08:00:00`), ROUTES[0]).activeSchedule.length > 0);
  }
  for (const date of ['2026-08-31', '2026-12-15', '2026-12-25', '2027-09-01']) {
    const info = getScheduleInfo(new Date(`${date}T08:00:00`), ROUTES[0]);
    assert.equal(info.isOutsideTerm, true);
    assert.equal(info.isNoService, false);
    assert.deepEqual(info.activeSchedule, []);
    for (const direction of ['to_school', 'to_station']) {
      assert.deepEqual(getUpcomingBuses(ROUTES[0], new Date(`${date}T08:00:00`), direction), []);
    }
  }
});

test('금요일·주말·휴일 규칙을 유지한다', () => {
  assert.ok(getScheduleInfo(new Date('2026-10-23T08:00:00'), ROUTES[0]).activeSchedule.every(item => !item.friOff));
  assert.equal(getScheduleInfo(new Date('2026-10-24T08:00:00'), route('onyang_asan')).isNoService, true);
  assert.equal(getScheduleInfo(new Date('2026-10-28T08:00:00'), ROUTES[0]).isNoService, true);
  assert.equal(getScheduleInfo(new Date('2026-10-05T08:00:00'), ROUTES[0]).scheduleType, 'sunday');
});

test('하교 승차 안내는 평일 경유 시간만 학생회관을 표시한다', () => {
  assert.match(next(ROUTES[0].id, '2026-10-26T13:35:00', 'to_station').boardingNotice, /학생회관 경유/);
  assert.doesNotMatch(next(ROUTES[0].id, '2026-10-26T10:00:00', 'to_station').boardingNotice, /학생회관/);
  assert.doesNotMatch(next(ROUTES[0].id, '2026-10-05T18:30:00', 'to_station').boardingNotice, /학생회관/);
  assert.equal(next(ROUTES[0].id, '2026-10-26T13:35:00').boardingNotice, '');
});

import React from 'react';
import { ROUTES } from '../data/shuttleData';
import { Navigation, Clock, AlertTriangle } from 'lucide-react';

export default function RouteSelector({
  selectedRouteId,
  onSelectRoute,
  directionFilter,
  onSelectDirection
}) {
  const currentRoute = ROUTES.find(r => r.id === selectedRouteId) || ROUTES[0];

  const currentPath = currentRoute.pathSummary?.[directionFilter] || currentRoute.pathSummary?.to_school;
  const currentTravelTime = currentRoute.travelTime?.[directionFilter] || currentRoute.travelTime?.to_school;
  const currentTrafficNotice = currentRoute.trafficNotice?.[directionFilter];

  return (
    <div className="route-selector-container">
      {/* Route Chips */}
      <div className="route-chips-scroll">
        {ROUTES.map(route => {
          const isSelected = route.id === selectedRouteId;

          return (
            <button
              key={route.id}
              type="button"
              className={`route-chip-btn ${isSelected ? 'active' : ''}`}
              style={{
                borderColor: isSelected ? route.color : 'var(--border-color)',
                backgroundColor: isSelected ? route.color : 'var(--bg-card)'
              }}
              onClick={() => onSelectRoute(route.id)}
            >
              <span>{route.shortName || route.name}</span>
            </button>
          );
        })}
      </div>

      {/* Control Box: Direction Switch & Direction-Specific Travel Time Card */}
      <div className="control-bar-box">
        {/* Direction Segmented Bar (등교 / 하교) */}
        <div className="direction-segmented">
          {[
            { id: 'to_school', label: '등교 (캠퍼스 도착 🏫)' },
            { id: 'to_station', label: '하교 (캠퍼스 출발 🚌)' }
          ].map(btn => (
            <button
              key={btn.id}
              type="button"
              className={`dir-seg-btn ${directionFilter === btn.id ? 'active' : ''}`}
              onClick={() => onSelectDirection(btn.id)}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Direction-Specific Travel Time & Route Card */}
        <div className="route-summary-banner">
          <div className="summary-row">
            <Clock size={14} className="banner-icon-green" />
            <div className="summary-text">
              <strong className="summary-label">
                {directionFilter === 'to_school' ? '등교 소요시간:' : '하교 소요시간:'}
              </strong>
              <span className="travel-time-highlight">{currentTravelTime}</span>
            </div>
          </div>

          {currentTrafficNotice && (
            <div className="summary-row special-note-row">
              <AlertTriangle size={13} className="banner-icon-orange" />
              <span>{currentTrafficNotice}</span>
            </div>
          )}

          <div className="summary-row" style={{ marginTop: 2 }}>
            <Navigation size={13} className="banner-icon-blue" />
            <div className="summary-text">
              <strong className="summary-label">운행경로:</strong>
              <span>{currentPath}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

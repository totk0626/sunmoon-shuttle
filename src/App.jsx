import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import NextShuttleCard from './components/NextShuttleCard';
import RouteSelector from './components/RouteSelector';
import TimetableList from './components/TimetableList';
import TimeSimulator from './components/TimeSimulator';
import ConvenienceModal from './components/ConvenienceModal';
import { ROUTES } from './data/shuttleData';

export default function App() {
  const [realTime, setRealTime] = useState(new Date());
  const [simulatedTime, setSimulatedTime] = useState(null);
  const [selectedRouteId, setSelectedRouteId] = useState('cheonan_asan_tangjeong');
  const [directionFilter, setDirectionFilter] = useState('to_school'); // 'to_school' (등교) or 'to_station' (하교)

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sunmoon_theme') || 'light';
  });

  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [isConvenienceOpen, setIsConvenienceOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sunmoon_theme', theme);
  }, [theme]);

  useEffect(() => {
    const timer = setInterval(() => {
      setRealTime(new Date());
      setSimulatedTime(prev => {
        if (!prev) return null;
        return new Date(prev.getTime() + 1000);
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const effectiveTime = simulatedTime || realTime;

  const handleToggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const currentRoute = ROUTES.find(r => r.id === selectedRouteId) || ROUTES[0];

  return (
    <div className="app-shell">
      <Header
        currentTime={effectiveTime}
        isSimulated={!!simulatedTime}
        onResetTime={() => setSimulatedTime(null)}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        onOpenInfo={() => setIsConvenienceOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      <main className="main-content container">
        <RouteSelector
          selectedRouteId={selectedRouteId}
          onSelectRoute={setSelectedRouteId}
          directionFilter={directionFilter}
          onSelectDirection={setDirectionFilter}
        />

        <NextShuttleCard
          selectedRoute={currentRoute}
          currentTime={effectiveTime}
          directionFilter={directionFilter}
          onOpenSimulator={() => setIsSimulatorOpen(true)}
        />

        <TimetableList
          route={currentRoute}
          currentTime={effectiveTime}
          directionFilter={directionFilter}
        />
      </main>

      <footer className="app-footer">
        <div className="container">
          <div>© 2026 선문대학교 셔틀버스 실시간 시간표 (2026-2학기)</div>
        </div>
      </footer>

      <TimeSimulator
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        currentTime={effectiveTime}
        onSetSimulatedTime={(date) => setSimulatedTime(date)}
        onResetTime={() => setSimulatedTime(null)}
        isSimulated={!!simulatedTime}
      />

      <ConvenienceModal
        isOpen={isConvenienceOpen}
        onClose={() => setIsConvenienceOpen(false)}
      />
    </div>
  );
}

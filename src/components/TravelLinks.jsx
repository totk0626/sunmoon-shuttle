import { useState } from 'react';
import { ArrowUpRight, Bus, MapPin, TrainFront, X } from 'lucide-react';
import { getTravelLink, TRAVEL_SERVICES } from '../utils/travelLinks';

export default function TravelLinks() {
  const [fallbackService, setFallbackService] = useState(null);

  const openService = (event, service) => {
    // Keep normal link behavior for new tabs and modified clicks.
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = getTravelLink(service, navigator);
    if (target === service.webUrl) return;

    event.preventDefault();
    setFallbackService(service);
    // A direct user gesture is required by mobile browsers. Do not redirect on
    // a timer: returning from the app must not unexpectedly open another page.
    window.location.assign(target);
  };

  const icons = { commuter: Bus, kakao: MapPin, korail: TrainFront };

  return (
    <section className="travel-shortcuts" aria-label="등하교 바로가기">
      <nav className="travel-links" aria-label="교통 서비스">
        {TRAVEL_SERVICES.map(service => {
          const Icon = icons[service.id];
          return (
            <a
              key={service.id}
              className="travel-link"
              href={service.webUrl}
              onClick={event => openService(event, service)}
            >
              <Icon size={16} aria-hidden="true" />
              <span>{service.name}</span>
              <ArrowUpRight size={13} aria-hidden="true" />
            </a>
          );
        })}
      </nav>
      {fallbackService && (
        <div className="travel-fallback" role="status">
          <div>
            <span>{fallbackService.name} 앱이 열리지 않나요?</span>
            <a href={fallbackService.webUrl}>웹으로 이용</a>
          </div>
          <button type="button" onClick={() => setFallbackService(null)} aria-label="앱 실행 안내 닫기">
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}
    </section>
  );
}

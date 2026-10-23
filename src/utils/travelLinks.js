export const TRAVEL_SERVICES = [
  {
    id: 'commuter',
    name: '통학버스',
    webUrl: 'https://smu.busro.net:456/rsvc/login.html?goUrl=/rsvc/'
  },
  {
    id: 'kakao',
    name: '카카오맵',
    webUrl: 'https://map.kakao.com/',
    // Official cross-platform mobile app bridge:
    // https://apis.map.kakao.com/ios_v2/docs/getting-started/urlscheme/
    mobileUrl: 'https://m.map.kakao.com/scheme/open'
  },
  {
    id: 'korail',
    name: '코레일',
    webUrl: 'https://www.korail.com/',
    // Main-screen scheme used by Korail's official web bundle. External app
    // handoff depends on the installed app/browser; keep a visible web fallback.
    mobileUrl: 'korailtalk://gotoMainViewContoller'
  }
];

export function getTravelLink(service, device = {}) {
  const isMobile = /Android|iPhone|iPad|iPod/i.test(device.userAgent || '')
    || (device.platform === 'MacIntel' && device.maxTouchPoints > 1);
  return isMobile && service.mobileUrl ? service.mobileUrl : service.webUrl;
}

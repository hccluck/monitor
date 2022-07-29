import { send, sendBeacon } from '../util/http';

export default function visibility() {
  document.addEventListener('visibilitychange', (e) => {
    if (document.visibilityState === 'hidden') {
      console.log('hide');
      sendBeacon({
        pageURL: window.location.href,
        referrer: document.referrer,
        type: 'behavior',
        subType: 'hidden',
        startTime: performance.now()
      });
    }

    if (document.visibilityState === 'visible') {
      console.log('show');
      send({
        pageURL: window.location.href,
        referrer: document.referrer,
        type: 'behavior',
        subType: 'visible',
        startTime: performance.now()
      });
    }
  });
}

import { send, sendBeacon } from '../util/http';
import reportPerformance from '../performance/index';
import device from '../device/index';

export default function load() {
  window.addEventListener(
    'load',
    (e) => {
      send({
        pageURL: window.location.href,
        referrer: document.referrer,
        type: 'behavior',
        subType: 'load',
        startTime: performance.now()
      });

      const idle = window.requestIdleCallback || setTimeout;

      idle(reportPerformance);
      idle(device);
    },
    true
  );

  window.addEventListener(
    'beforeunload',
    (e) => {
      sendBeacon({
        pageURL: window.location.href,
        referrer: document.referrer,
        type: 'behavior',
        subType: 'unload',
        startTime: performance.now()
      });
    },
    true
  );
}

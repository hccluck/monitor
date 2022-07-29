import { send } from '../util/http';

export default function () {
  const performanceOrigin = window.performance || window.webkitPerformance || window.msPerformance;

  const [{ domComplete }] = performanceOrigin.getEntriesByType('navigation');
  const list = performanceOrigin.getEntriesByType('resource');

  send({
    domComplete,
    startTime: performance.now(),
    subType: 'navigation',
    type: 'performance',
    pageURL: window.location.href
  });

  const slow = [];
  const MAX_TIME = 10_000;
  for (let item of list) {
    const time = item.responseEnd - item.startTime;
    if (time > MAX_TIME) {
      slow.push(item.name);
    }
  }

  send({
    startTime: performance.now(),
    subType: 'resource',
    type: 'performance',
    source: slow.join(','),
    pageURL: window.location.href
  });
}

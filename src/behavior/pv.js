import { send } from '../util/http';

export default function pv() {
  let from = '';
  window.addEventListener(
    'popstate',
    () => {
      const to = window.location.href;

      console.log('to', to);

      send({
        from,
        to,
        type: 'behavior',
        subType: 'popstate',
        startTime: performance.now()
      });

      from = to;
    },
    true
  );

  let oldURL = '';
  window.addEventListener(
    'hashchange',
    (event) => {
      const to = event.newURL;

      console.log('newURL', to);

      send({
        from: oldURL,
        to,
        type: 'behavior',
        subType: 'hashchange',
        startTime: performance.now()
      });

      oldURL = to;
    },
    true
  );
}

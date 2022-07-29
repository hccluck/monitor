import { send } from '../util/http';

export default function error() {
  const error = window.console.error;
  window.console.error = (...args) => {
    error.apply(this, args);

    send({
      type: 'error',
      subType: 'console-error',
      startTime: performance.now(),
      errData: args,
      pageURL: window.location.href
    });
  };

  document.addEventListener(
    'error',
    (e) => {
      console.log('d-error', e);

      const target = e.target;
      if (!target) return;

      if (target.src || target.href) {
        const url = target.src || target.href;

        send({
          url,
          type: 'error',
          subType: 'resource',
          startTime: e.timeStamp,
          html: target.outerHTML,
          resourceType: target.tagName,
          paths: e.path.map((item) => item.tagName).filter(Boolean),
          pageURL: window.location.href
        });
      }
    },
    true
  );

  window.addEventListener(
    'error',
    (e) => {
      console.log('w-error', e);

      const target = e.target;
      if (!target) return;

      if (target.src || target.href) {
        const url = target.src || target.href;

        send({
          url,
          type: 'error',
          subType: 'resource',
          startTime: e.timeStamp,
          html: target.outerHTML,
          resourceType: target.tagName,
          paths: e.path.map((item) => item.tagName).filter(Boolean),
          pageURL: window.location.href
        });
      } else {
        send({
          msg: e.message,
          line: e.lineno,
          column: e.colno,
          error: e.error.stack,
          subType: 'js',
          pageURL: window.location.href,
          type: 'error',
          startTime: performance.now()
        });
      }
    },
    true
  );

  window.addEventListener('unhandledrejection', (e) => {
    send({
      msg: e.message,
      line: e.lineno,
      column: e.colno,
      error: e.reason.stack || e.reason,
      subType: 'promise',
      pageURL: window.location.href,
      type: 'error',
      startTime: performance.now()
    });
  });
}

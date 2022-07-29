(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Monitor = factory());
})(this, (function () { 'use strict';

  const config = {
    url: '',
    appid: '',
    userid: ''
  };

  function isSupportSendBeacon() {
    return !!window.navigator?.sendBeacon;
  }

  function sendBeacon(params) {
    const data = new FormData();

    for (let key in params) {
      data.append(key, params[key] ?? '');
    }

    data.append('appid', config.appid);
    data.append('userid', config.userid);

    const request = isSupportSendBeacon() ? window.navigator.sendBeacon.bind(window.navigator) : sendData;

    console.log(request === sendData);

    console.log(data);

    request(config.url, data);
  }

  function sendData(url, data) {
    const xhr = new XMLHttpRequest();

    xhr.open('POST', url);
    xhr.send(data);
  }

  function send(params) {
    let data = '?';

    for (let key in params) {
      const value = encodeURIComponent(params[key] || '');
      data += `${key}=${value}&`;
    }

    data += `appid=${config.appid}&`;
    data += `userid=${config.userid}`;

    const img = new Image();
    img.src = config.url + data;
  }

  function error() {
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

  function pv() {
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

  function click() {
    ['mousedown', 'touchstart'].forEach((eventType) => {
      window.addEventListener(
        eventType,
        (e) => {
          console.log(e);
          const target = e.target;
          const { top, left } = target.getBoundingClientRect();

          send({
            top,
            left,
            eventType,
            pageHeight: document.documentElement.scrollHeight || document.body.scrollHeight,
            scrollTop: document.documentElement.scrollTop || document.body.scrollTop,
            type: 'behavior',
            subType: 'click',
            target: target.tagName,
            paths: e.path?.map((item) => item.tagName).filter(Boolean),
            startTime: e.timeStamp,
            pageURL: window.location.href,
            outerHTML: target.outerHTML,
            innerHTML: target.innerHTML,
            width: target.offsetWidth,
            height: target.offsetHeight,
            viewportW: window.innerWidth,
            viewportH: window.innerHeight
          });
        },
        true
      );
    });
  }

  function reportPerformance () {
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

  function device () {

    send({
      type: 'device',
      data: window.navigator.userAgent
    });
  }

  function load() {
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

  function visibility() {
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

  function behavior() {
    load();
    pv();
    click();
    visibility();
  }

  function Monitor(options) {
    config.url = options.url;
    config.userid = '1212';

    error();
    behavior();
  }

  Monitor.prototype.report = send;

  return Monitor;

}));

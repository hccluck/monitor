import { send } from '../util/http';

export default function click() {
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

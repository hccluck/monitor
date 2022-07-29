import { send } from '../util/http';

export default function () {
  window.navigator.userAgent;

  send({
    type: 'device',
    data: window.navigator.userAgent
  });
}

import config from '../config';

export function isSupportSendBeacon() {
  return !!window.navigator?.sendBeacon;
}

export function sendBeacon(params) {
  const data = new FormData();

  for (let key in params) {
    data.append(key, encodeURIComponent(params[key] ?? ''));
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

export function send(params) {
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

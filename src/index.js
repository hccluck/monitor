import { send } from './util/http';
import config from './config';
import error from './error/index';
import behavior from './behavior/index';

function Monitor(options) {
  config.url = options.url;
  config.userid = '1212';

  error();
  behavior();
}

Monitor.prototype.report = send;

export default Monitor;

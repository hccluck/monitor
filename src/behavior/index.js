import pv from './pv';
import click from './click';
import load from './load';
import visibility from './visibility';

export default function behavior() {
  load();
  pv();
  click();
  visibility();
}

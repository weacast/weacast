// import createService from '@weacast/service'
// import errors from 'feathers-errors';
import makeDebug from 'debug';

const debug = makeDebug('weacast-arpege');

export default function init () {
  // const app = this;

  debug('Initializing weacast-arpege plugin');
  // const arpege = createService('arpege', app)
  return 'weacast-arpege';
}

import moment from 'moment';

import LimitedCache from '../lib/LimitedCache';

const momentCache = new LimitedCache();

export default function getMoment(timestamp) {
  let cachedMoment = momentCache.get(timestamp);
  if (cachedMoment) {
    cachedMoment = moment(timestamp);
    momentCache.set(timestamp, cachedMoment);
  }
  return cachedMoment;
}

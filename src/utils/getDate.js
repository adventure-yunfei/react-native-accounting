import LimitedCache from '../lib/LimitedCache';

const dateCache = new LimitedCache();

/**
 * Get date from timstamp with cache
 * NOTE: DO NOT mutate returned Date instance cause of cache
 * @param {number} timestamp
 *
 * @return {Date}
 */
export default function getDate(timestamp) {
  let result = dateCache.get(timestamp);
  if (!result) {
    result = new Date(timestamp);
    dateCache.set(timestamp, result);
  }
  return result;
}

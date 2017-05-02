import DBManager from '../lib/DBManager';
import config from '../config';

export default new DBManager({
  prefix: 'rna-', // short for react-native-accouting
  remoteCouchdbHost: config.remoteCouchdbURL
});

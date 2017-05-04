import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
import omit from 'lodash/omit';

import databases from '../databases';

const dbChanges = {};
const KeyNoListenChanges = '$noListenChanges';

class ReadOnlyDB {
  constructor(db, dbName, dataCalls) {
    this._db = db;
    this._dbName = dbName;
    this._dataCalls = dataCalls;
  }
  _onDataCall(method, args) {
    this._dataCalls.push([
      this._dbName,
      method,
      args
    ]);
    return this._db[method](...args);
  }
  get(...args) {
    return this._onDataCall('get', args);
  }
  allDocs(...args) {
    return this._onDataCall('allDocs', args);
  }
  allDocsData(...args) {
    return this._onDataCall('allDocsData', args);
  }
  query(...args) {
    return this._onDataCall('query', args);
  }
  find(...args) {
    return this._onDataCall('find', args);
  }
}

function getReadOnlyDBs() {
  const result = {
    __dataCalls: [] // Record fetch data calls
  };
  Object.keys(databases).forEach((name) => {
    result[name] = new ReadOnlyDB(databases[name], name, result.__dataCalls);
  });
  return result;
}

function listenToDBChanges(dataCalls, callback) {
  const unlistens = dataCalls.map(([dbName/* , method, ...args */]) => {
    let change = dbChanges[dbName];
    if (!change) {
      change = databases[dbName].changes({
        since: 'now',
        live: true
      });
      dbChanges[dbName] = change;
    }
    change.on('change', callback);
    return function unlisten() {
      change.removeListener('change', callback);
    };
  });
  return function cancel() {
    unlistens.forEach(unlisten => unlisten());
  };
}

export default function connectDB(mapDBsToProps) {
  return (ViewComponent) => {
    class DBConnectWrapper extends React.PureComponent {
      state = {
        databases
      }

      componentWillMount() {
        this.__mounted = true;
        const doMapDBs = () => {
          const dbs = getReadOnlyDBs();
          this.__processingDBs = dbs;
          mapDBsToProps(dbs, this.props)
            .then((data) => {
              if (this.__mounted && dbs === this.__processingDBs) {
                if (this.__unlistenDBChanges) {
                  this.__unlistenDBChanges();
                }
                this.__unlistenDBChanges = data[KeyNoListenChanges] ?
                  null : listenToDBChanges(dbs.__dataCalls, doMapDBs);
                this.setState(omit(data, [KeyNoListenChanges]));
              }
            });
        };
        doMapDBs();
      }

      componentWillUnmount() {
        this.__mounted = false;
        if (this.__unlistenDBChanges) {
          this.__unlistenDBChanges();
        }
      }

      render() {
        return <ViewComponent {...this.props} {...this.state} />;
      }
    }

    hoistNonReactStatic(DBConnectWrapper, ViewComponent);

    return DBConnectWrapper;
  };
}

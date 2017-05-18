import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import injection from './injection';
import onError from '../../lib/onError';

const { injected } = injection;

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

export function getReadOnlyDBs() {
  const result = {
    __dataCalls: [] // Record fetch data calls
  };
  Object.keys(injected.databases).forEach((name) => {
    result[name] = new ReadOnlyDB(injected.databases[name], name, result.__dataCalls);
  });
  return result;
}

function listenToDBChanges(dataCalls, callback) {
  const unlistens = dataCalls.map(([dbName/* , method, ...args */]) => {
    injected.databases[dbName].onChanges(callback);
    return function unlisten() {
      injected.databases[dbName].offChanges(callback);
    };
  });
  return function cancel() {
    unlistens.forEach(unlisten => unlisten());
  };
}

export default function connectDB(mapDBsToProps, { listenChanges = true } = {}) {
  return (ViewComponent) => {
    class DBConnectWrapper extends React.PureComponent {
      state = {
        databases: injected.databases
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
                this.__unlistenDBChanges
                  = listenChanges ? listenToDBChanges(dbs.__dataCalls, doMapDBs) : null;
                this.setState(data);
              }
            })
            .catch(onError('mapDBsToProps'));
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

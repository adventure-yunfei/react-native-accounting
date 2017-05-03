import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';

import databases from '../databases';

const dbChanges = {};

function getReadOnlyDBs() {
  const result = {
    __dataCalls: [] // Record fetch data calls
  };
  Object.keys(databases).forEach((name) => {
    const db = databases[name];
    result[name] = {
      get(...args) {
        result.__dataCalls.push([name, 'get', ...args]);
        return db.get(...args);
      },
      allDocs(...args) {
        result.__dataCalls.push([name, 'allDocs', ...args]);
        return db.allDocs(...args);
      },
      allDocsData(...args) {
        result.__dataCalls.push([name, 'allDocsData', ...args]);
        return db.allDocsData(...args);
      }
    };
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
          this.__readOnlyDBs = dbs;
          mapDBsToProps(dbs, this.props)
            .then((data) => {
              if (this.__mounted && dbs === this.__readOnlyDBs) {
                if (this.__unlistenDBChanges) {
                  this.__unlistenDBChanges();
                }
                this.__unlistenDBChanges = listenToDBChanges(dbs.__dataCalls, doMapDBs);
                // listenToDBChanges(dbs.__dataCalls, () => doMapDBs());
                this.setState(data);
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

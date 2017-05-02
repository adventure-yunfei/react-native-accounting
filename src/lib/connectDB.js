import React from 'react';

import databases from '../databases';

function getReadOnlyDBs() {
  const result = {
    __dataCalls: [] // Record fetch data calls
  };
  for (const name in databases) {
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
  }
  return result;
}

function listenToDBChanges(dataCalls, callback) {
  const changes = dataCalls.map(([dbName, method, ...args]) => {
    return databases[dbName].changes({
      since: 'now',
      live: true
    }).on('change', callback);
  });
  return function cancel() {
    changes.forEach(chg => chg.cancel());
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
                this.__unlistenDBChanges && this.__unlistenDBChanges();
                this.__unlistenDBChanges = listenToDBChanges(dbs.__dataCalls, doMapDBs);
                this.setState(data);
              }
            });
        };
        doMapDBs();
      }

      componentWillUnmount() {
        this.__mounted = false;
        this.__unlistenDBChanges && this.__unlistenDBChanges();
      }

      render() {
        return <ViewComponent {...this.props} {...this.state} />;
      }
    }

    return DBConnectWrapper;
  };
}

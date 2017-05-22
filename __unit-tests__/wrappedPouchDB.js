import { assert } from 'chai';
import padStart from 'lodash/padStart';
import omit from 'lodash/omit';
import { compile } from 'immutable-json-schema';
import { WrappedPouchDB } from '../src/lib/pouchdb-connector';

let idCnt = 0;
const testDB = global._testdb = new WrappedPouchDB({
  name: 'test',
  extra: {
    schema: compile({ _id: 'string', text: 'string', __options: { notRequired: ['text'] } }),
    generateID: () => {
      idCnt += 2;
      return padStart(idCnt.toString(), 5, '0');
    }
  }
});

function removeRev(docs) {
  return docs.map((doc) => {
    if (!doc._rev) {
      throw new Error('document没有_rev属性');
    }
    return omit(doc, ['_rev']);
  });
}

const allDocs = new Array(100).fill(0).map(() => ({
  _id: testDB.generateID()
}));

testDB.validatingBulkDocs(allDocs)
  .then(() => {
    return testDB.allDocsData().then((docs) => {
      assert.deepEqual(removeRev(docs), allDocs);
    });
  })
  .then(() => {
    return testDB.allDocsData({ descending: true }).then((docs) => {
      assert.deepEqual(removeRev(docs), allDocs.concat().reverse());
    });
  })
  .then(() => {
    return testDB.allDocsData({
      limit: 20,
      skip: 4
    }).then((docs) => {
      assert.deepEqual(removeRev(docs), allDocs.slice(4, 24));
    });
  })
  .then(() => {
    return testDB.allDocsData({
      startkey: '00004',
      endkey: '00009'
    }).then((docs) => {
      assert.deepEqual(removeRev(docs), allDocs.slice(1, 4));
    });
  })
  .then(() => {
    return testDB.allDocsData({
      startkey: '00004',
      endkey: '00010'
    }).then((docs) => {
      assert.deepEqual(removeRev(docs), allDocs.slice(1, 5));
    });
  })
  .then(() => {
    return testDB.allDocsData({
      startkey: '00004',
      endkey: '00011',
      limit: 100,
      skip: 1
    }).then((docs) => {
      assert.deepEqual(removeRev(docs), allDocs.slice(2, 5));
    });
  })
  .then(() => {
    return testDB.allDocsData({
      startkey: '00004',
      endkey: '00011',
      limit: 2,
      skip: 1
    }).then((docs) => {
      assert.deepEqual(removeRev(docs), allDocs.slice(2, 4));
    });
  })
  .then(() => {
    return testDB.allDocsData({
      descending: true,
      startkey: '00004',
      endkey: '00011'
    }).then((docs) => {
      assert.deepEqual(removeRev(docs), []);
    });
  })
  .then(() => {
    return testDB.allDocsData({
      descending: true,
      startkey: '00011',
      endkey: '00004'
    }).then((docs) => {
      assert.deepEqual(removeRev(docs), allDocs.slice(1, 5).reverse());
    });
  })
  .then(() => {
    return testDB.allDocsData({
      descending: true,
      startkey: '00010',
      endkey: '00003'
    }).then((docs) => {
      assert.deepEqual(removeRev(docs), allDocs.slice(1, 5).reverse());
    });
  })
  .then(() => {
    return testDB.allDocsData({
      descending: true,
      startkey: '00011',
      endkey: '00003',
      limit: 3,
      skip: 2
    }).then((docs) => {
      assert.deepEqual(removeRev(docs), allDocs.slice(1, 3).reverse());
    });
  })
  .then(() => {
    return testDB.validatingPut({
      _id: '00007'
    })
      .then(() => testDB.allDocsData())
      .then((docs) => {
        assert.deepEqual(
          removeRev(docs),
          allDocs.slice(0, 3).concat([{ _id: '00007' }]).concat(allDocs.slice(3))
        );
      });
  })
  .then(() => {
    return testDB.validatingBulkDocs([{
      _id: '00007'
    }])
      .then(() => assert.Throw('不应当成功'), () => {});
  })
  .then(() => {
    return testDB.allDocsData({
      keys: ['00007', '00012']
    })
      .then(([doc7, doc12]) => testDB.validatingBulkDocs([
        { _id: '00011' },
        { _id: '00005' },
        { ...doc7, _deleted: true },
        { ...doc12, text: 'foo' }
      ]))
      .then(() => testDB.allDocsData())
      .then((docs) => {
        const newDocs = allDocs.concat();
        newDocs.splice(2, 0, { _id: '00005' });
        newDocs.splice(6, 0, { _id: '00011' });
        newDocs[7] = {
          ...newDocs[7],
          text: 'foo'
        };
        assert.deepEqual(removeRev(docs), newDocs);
      });
  })
  .then(() => console.warn('test success'), err => console.error(err))
  .then(() => testDB.originDB.destroy());

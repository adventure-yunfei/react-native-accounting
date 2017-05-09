import dbManager from './dbManager';
import AccountsDB from './AccountsDB';
import CategoriesDB from './CategoriesDB';
import RecordsDB from './RecordsDB';
// import DebtorsDB from './DebtorsDB';

export default dbManager.databases;

export function initializeDBs() {
  return Promise.all([
    AccountsDB.initializeDB(),
    CategoriesDB.initializeDB(),
    RecordsDB.initializeDB(),
    // DebtorsDB.initializeDB()
  ]);
}

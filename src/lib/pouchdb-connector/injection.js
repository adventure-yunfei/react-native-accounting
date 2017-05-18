const injected = {
  databases: null
};

export default {
  injected,

  injectDatabases(databases) {
    injected.databases = databases;
  }
};

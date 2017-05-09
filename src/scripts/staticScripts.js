const fs = require('fs-extra');
const path = require('path');

const FEIDEE_DIR = path.resolve(__dirname, 'feidee');

function transformFeideeCSVToJson() {
  fs.readdirSync(FEIDEE_DIR)
    .filter(filename => filename.endsWith('.csv'))
    .forEach((filename) => {
      const content = fs.readFileSync(path.resolve(FEIDEE_DIR, filename), 'utf8');
      const lines = content.split('\r\n').map(line => line.split(','));
      const titles = lines[0];
      const data = lines.slice(1).filter(d => !d.every(item => !item));

      const json = data.map(d => titles.reduce((acc, title, idx) => {
        acc[title] = d[idx];
        return acc;
      }, {}));

      titles.forEach((title) => {
        if (json.every(d => !d[title])) {
          json.forEach((d) => { delete d[title]; });
        }
      });

      fs.outputJsonSync(
        path.resolve(FEIDEE_DIR, `_${filename.replace('.csv', '.json')}`),
        json,
        { spaces: 2 }
      );
    });
}

transformFeideeCSVToJson();

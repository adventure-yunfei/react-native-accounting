const fs = require('fs');
const path = require('path');

const chartJsPath = require.resolve('chart.js/dist/Chart.bundle.min.js');

function readFile(filepath) {
  return fs.readFileSync(path.resolve(__dirname, filepath), 'utf8');
}

const chartsHtml = readFile('src/charts.html');
const chartJs = readFile(chartJsPath);
const appJs = readFile('./src/chartsApp.js');

fs.writeFileSync(
  path.resolve(__dirname, 'build/chats.html'),

  chartsHtml
    .replace('{{chart.js}}', chartJs)
    .replace('{{app.js}}', appJs)
);


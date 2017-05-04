(function () {
  var chartCtxt = document.getElementById('chart-context');
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;
  chartCtxt.width = width;
  chartCtxt.height = height;

  var chart = null;
  function onGetChartOptions(opt) {
    if (chart) {
      chart.destroy();
    }
    chart = new Chart(chartCtxt, opt);
  }

  document.addEventListener('message', function (message) {
    onGetChartOptions(JSON.parse(message.data));
  });

  // window.onerror = function (err) {
  //   window.postMessage(err.toString());
  // }
}());

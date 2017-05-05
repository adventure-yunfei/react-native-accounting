import React, { PropTypes } from 'react';

import WebView from '../../components/WebView';
import chartsHtml from '../../../static/build/chats.html';

const BackgroundColors = ['#FF6384', '#36A2EB', '#FFCE56'];
const HoverBackgroundColors = ['#FF6384', '#36A2EB', '#FFCE56'];

const exampleDatas = [
  { label: '示例-1', value: 100 },
  { label: '示例-2', value: 200 },
  { label: '示例-3', value: 300 }
];

export default class ChartsScreen extends React.PureComponent {
  static propTypes = {
    chartData: PropTypes.array.isRequired
  }

  componentDidMount() {
    const { chartData } = this.props;
    this.sendDataToWebView(chartData.length ? chartData : exampleDatas);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.chartData.length && nextProps.chartData !== this.props.chartData) {
      this.sendDataToWebView(nextProps.chartData.length ? nextProps.chartData : exampleDatas);
    }
  }

  sendDataToWebView(chartData) {
    this._webview.postMessage(JSON.stringify({
      type: 'pie',
      data: {
        labels: chartData.map(d => d.label),
        datasets: [{
          data: chartData.map(d => d.value),
          backgroundColor: BackgroundColors.slice(0, chartData.length),
          hoverBackgroundColor: HoverBackgroundColors.slice(0, chartData.length)
        }]
      }
    }));
  }

  render() {
    return (
      <WebView
        ref={webview => this._webview = webview} source={chartsHtml}
      />
    );
  }
}

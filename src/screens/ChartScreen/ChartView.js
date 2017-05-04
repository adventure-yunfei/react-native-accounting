import React, { PropTypes } from 'react';

import WebView from '../../components/WebView';
import chartsHtml from '../../../static/build/chats.html';

const BackgroundColors = ['#FF6384', '#36A2EB', '#FFCE56'];
const HoverBackgroundColors = ['#FF6384', '#36A2EB', '#FFCE56'];

export default class ChartsScreen extends React.PureComponent {
  static propTypes = {
    chartData: PropTypes.array.isRequired
  }

  componentDidMount() {
    const { chartData } = this.props;
    if (chartData.length) {
      this.sendDataToWebView(chartData);
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.chartData.length && nextProps.chartData !== this.props.chartData) {
      this.sendDataToWebView(nextProps.chartData);
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

import React from 'react';
import { WebView as RawWebView } from 'react-native';

/**
 * 扩展原WebView组件，使得 .postMessage 可以立即调用
 */
export default class WebView extends React.PureComponent {
  static propTypes = RawWebView.propTypes

  constructor(...args) {
    super(...args);

    this._webview = null;
    this._webviewLoaded = false;
    this._messageQueue = [];
  }

  componentWillUnmount() {
    this._webviewLoaded = false;
  }

  onLoad = () => {
    if (this.props.onLoad) {
      this.props.onLoad();
    }
    this._webviewLoaded = true;

    const messageQueue = this._messageQueue;
    while (messageQueue.length) {
      const message = messageQueue.shift();
      this._webview.postMessage(message);
    }
  }

  postMessage(message) {
    if (this._webviewLoaded) {
      this._webview.postMessage(message);
    } else {
      this._messageQueue.push(message);
    }
  }

  render() {
    return (
      <RawWebView
        ref={webview => this._webview = webview}
        {...this.props}
        onLoad={this.onLoad}
      />
    );
  }
}

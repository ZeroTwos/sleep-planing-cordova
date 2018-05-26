import 'babel-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import ons from 'onsenui';
import Editor from './containers/Editor/Editor.jsx'

import 'onsenui/css/onsenui.css';
import './styles/onsen-css-components.css';
import './styles/index.scss'

ons.ready(function() {
  if (window.MobileAccessibility) {
    // disable font zooming
    // @see https://stackoverflow.com/questions/15194940/phonegap-application-text-and-layout-too-small
    window.MobileAccessibility.usePreferredTextZoom(false);
  }

  const loadingScreen = document.getElementById('loading');
  loadingScreen.parentNode.removeChild(loadingScreen);

  ReactDOM.render(
    <Editor/>,
    document.getElementById('app')
  );
});

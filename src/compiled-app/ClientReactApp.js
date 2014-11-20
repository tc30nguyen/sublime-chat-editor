var React = require('react');
var ChatApp = require('./ChatApp.react');
var ViewActions = require('./actions/ViewActions');
var ChatSocketClientHandler = require('./ChatSocketClientHandler');

// connect view action to client-side socket handler
ViewActions.setSocketHandler(ChatSocketClientHandler);

// browser global react for debugging
window.React = React;

React.render(
  React.createElement(ChatApp, null),
  document.getElementById('app')
);
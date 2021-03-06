var React = require('react/addons');
var CSSTransitionGroup = React.addons.CSSTransitionGroup;
var UserStore = require('./stores/UserStore');
var MessageStore = require('./stores/MessageStore');
var TypingUserStore = require('./stores/TypingUserStore');
var Login = require('./components/Login.react');
var ChatTop = require('./components/ChatTop.react');
var ChatBottom = require('./components/ChatBottom.react');

function getStateFromStores() {
  return {
    username: UserStore.getUsername(),
    allUsers: UserStore.getAllUsers(),
    messages: MessageStore.getMessages(),
    typingText: TypingUserStore.getTypingUsersText()
  }
}

var ChatApp = React.createClass({
  getInitialState: function() {
    return getStateFromStores();
  },

  componentDidMount: function() {
    MessageStore.addChangeListener(this._onChange);
    UserStore.addChangeListener(this._onChange);
    TypingUserStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    MessageStore.removeChangeListener(this._onChange);
    UserStore.removeChangeListener(this._onChange);
    TypingUserStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var loggedIn = !!this.state.username.trim();
    var messages = [];

    if(this.state.username) {
      messages = this.state.messages.slice(0);

      if(this.state.typingText) messages.push(this.state.typingText);
    }

    // add blinker
    messages.push('<span class="blinking">|</span>');

    return (
      <div className="chat-app">
        <CSSTransitionGroup transitionName="login-transition">
          { loggedIn ? null : <Login key="Login"/> }
        </CSSTransitionGroup>

        <ChatTop
          allUsers={this.state.allUsers}
          messages={messages}
          loggedIn={loggedIn} />

        <ChatBottom
          allUsers={this.state.allUsers}
          messages={messages}
          loggedIn={loggedIn} />
      </div>
    );
  },

  _onChange: function() {
    this.setState(getStateFromStores());
  }
});

module.exports = ChatApp;
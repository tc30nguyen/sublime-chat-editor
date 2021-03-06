var Constants = require('../constants/FluxConstants');
var LanguageClasses = Constants.LanguageClasses;
var MessageTypes = Constants.MessageTypes;

var INDENT_REGEX = /\{\{indent\}\}/;
var COMMENT_REGEX = /\/\*[\s\S]*?\*\/|\/\/[^\n]*(?:$|\n)/;
var STRING_REGEX = /("|')[\s\S]*?\1/;
var FUNCTION_REGEX = /\bfunction(?:(\s+?)(\w+?))?(\s*?)\(([\w,\s]*?)\)/;
var OPERATOR_REGEX = /'-|static|\+|\*|=|~|!|\$|\*|~|\<|\>|&&|\|\|'/;
var KEYWORD_REGEX = /\b(?:break|case|catch|const|continue|debugger|default|delete|do|else|export|extends|finally|for|if|import|in|instanceof|new|return|switch|throw|try|typeof|while|with)\b/;
var NUMBER_REGEX = /\b[0-9]+\b/;
var VAR_REGEX  = /\bvar|function\b/;
var RESERVED_REGEX = /\.(log|port)/; // lazy

var escapeHtml = require('./escapeHtml');

function wrapSpanFactory(className) {
  return function(source) {
    return '<span class="' + className + '">' + escapeHtml(source) + '</span>';
  }
}

// rules for JavaScript syntax transform
var passes = [
  {
    regex: INDENT_REGEX,
    process: function() {
      return '<span class="' + LanguageClasses.INDENT
        + '">&nbsp;&nbsp;</span>';
    }
  },
  {
    regex: STRING_REGEX,
    process: wrapSpanFactory(LanguageClasses.STRING)
  },
  {
    regex: COMMENT_REGEX,
    process: wrapSpanFactory(LanguageClasses.COMMENT)
  },
  {
    regex: FUNCTION_REGEX,
    process: '<span class="' + LanguageClasses.VAR +
      '">function</span>$1<span class="' + LanguageClasses.FUNCTION +
      '">$2</span>$3(<span class="' + LanguageClasses.ARGUMENT + '">$4</span>)'
  },
  {
    regex: OPERATOR_REGEX,
    process: wrapSpanFactory(LanguageClasses.OPERATOR)
  },
  {
    regex: KEYWORD_REGEX,
    process: wrapSpanFactory(LanguageClasses.OPERATOR)
  },
  {
    regex: NUMBER_REGEX,
    process: wrapSpanFactory(LanguageClasses.NUMBER)
  },
  {
    regex: VAR_REGEX,
    process: wrapSpanFactory(LanguageClasses.VAR)
  },
  {
    regex: RESERVED_REGEX,
    process: '.<span class="' + LanguageClasses.RESERVED + '">$1</span>'
  }
];

var MessageTransformer = require('./StringTransformer')(passes);

module.exports = function(message) {
  return MessageTransformer.transform(message);
};
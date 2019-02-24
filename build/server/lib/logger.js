"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setLogFilePath = setLogFilePath;
exports.default = void 0;

var _log4js = _interopRequireDefault(require("log4js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let loggerConfig = {
  appenders: {
    out: {
      type: 'stdout',
      layout: {
        type: process.env.NODE_ENV !== 'production' ? 'coloured' : 'basic'
      }
    }
  },
  categories: {
    default: {
      appenders: ['out'],
      level: 'debug'
    }
  }
};

if (process.env.NODE_ENV === 'test') {
  // Disable application logging for testing.
  loggerConfig.categories.default.level = 'off';
}

_log4js.default.configure(loggerConfig);

function setLogFilePath(path) {
  loggerConfig.appenders.app = {
    type: 'file',
    filename: path
  };
  loggerConfig.categories.default.appenders.push('app');

  _log4js.default.configure(loggerConfig);
}

class Logger {
  constructor(prefix) {
    this.prefix = prefix;
    this.logger = _log4js.default.getLogger(prefix);
  }

  stringify(text) {
    if (text instanceof Error && text.stack) {
      return text.stack;
    }

    if (text instanceof Object) {
      return JSON.stringify(text);
    }

    return text;
  }

  info(...texts) {
    return this.logger.info(texts.map(this.stringify).join(' '));
  }

  warn(...texts) {
    return this.logger.warn(texts.map(this.stringify).join(' '));
  }

  error(...texts) {
    return this.logger.error(texts.map(this.stringify).join(' '));
  }

  debug(...texts) {
    if (process.env.DEBUG) {
      return this.logger.debug(texts.map(this.stringify).join(' '));
    }
  }

  raw(...texts) {
    return this.logger.trace(texts.map(this.stringify).join(' '));
  }

}

exports.default = Logger;
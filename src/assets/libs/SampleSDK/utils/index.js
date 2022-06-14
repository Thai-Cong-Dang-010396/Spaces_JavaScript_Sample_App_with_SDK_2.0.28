import moment from 'moment';

export function toUTCDate(date) {
  const UTCDate = new Date(date).toUTCString();

  return UTCDate;
}

export function trimHTML(string) {
  const res = string.replace(/<[^>]*>?/gm, '');

  return res;
}

export function displayMeetingDuration(end, start) {
  let text = '';

  if (moment(end).diff(moment(start)) > 3600000) {
    moment(end).diff(moment(start), 'hours') === 1 ? (text = 'hour') : (text = 'hours');

    return `${moment(end).diff(moment(start), 'hours')} ${text}`;
  }
  if (moment(end).diff(moment(start)) > 60000 < 3600000) {
    moment(end).diff(moment(start), 'minutes') === 1 ? (text = 'minute') : (text = 'minutes');

    return `${moment(end).diff(moment(start), 'minutes')} ${text}`;
  }
  if (moment(end).diff(moment(start)) < 60000)
    return `${moment(end).diff(moment(start), 'seconds')} seconds`;
}

export const Base64 = {
  // private property
  _keyStr: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',

  // public method for decoding
  decode(input) {
    let output = '';
    let chr1;
    let chr2;
    let chr3;
    let enc1;
    let enc2;
    let enc3;
    let enc4;
    let i = 0;

    // input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');
    input = input.replace(/[^A-Za-z0-9+/=]/g, '');

    while (i < input.length) {
      enc1 = Base64._keyStr.indexOf(input.charAt(i++));
      enc2 = Base64._keyStr.indexOf(input.charAt(i++));
      enc3 = Base64._keyStr.indexOf(input.charAt(i++));
      enc4 = Base64._keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output += String.fromCharCode(chr1);

      if (enc3 !== 64) {
        output += String.fromCharCode(chr2);
      }
      if (enc4 !== 64) {
        output += String.fromCharCode(chr3);
      }
    }

    output = Base64._utf8_decode(output);

    return output;
  },

  isBase64(str) {
    if (!str) {
      return false;
    }

    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;

    return base64regex.test(str);
  },

  // private method for UTF-8 decoding
  _utf8_decode(utftext) {
    let string = '';
    let i = 0;
    let c = 0;
    // c1 = 0,
    let c2 = 0;
    let c3 = 0;

    while (i < utftext.length) {
      c = utftext.charCodeAt(i);

      if (c < 128) {
        string += String.fromCharCode(c);
        i++;
      } else if (c > 191 && c < 224) {
        c2 = utftext.charCodeAt(i + 1);
        string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
        i += 2;
      } else {
        c2 = utftext.charCodeAt(i + 1);
        c3 = utftext.charCodeAt(i + 2);
        string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
        i += 3;
      }
    }

    return string;
  }
};

export const getGUID = () => {
  let date = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (date + Math.random() * 16) % 16 | 0;

    date = Math.floor(date / 16);

    return (c === 'x' ? r : (r & 0x7) | 0x8).toString(16);
  });

  return uuid;
};

export class LoggerTags {
  static CLOUD_COMMUNICATION = 'CLOUD_COMMUNICATION';

  static CALL_SESSION = 'CALL_SESSION';

  static SOCKET_IO_PROVIDER = 'SocketIoProvider';

  static REST_PROVIDER = 'RestProvider';

  static CALL = 'Call';

  static SESSION = 'Session';
}

/**
 * Logger class for CloudCommunication
 * @hideconstructor
 */
export class Logger {
  static #timezoneOffset;

  static #timezoneOffsetStr;

  static #locale;

  /**
   * @type {AvayaClientServices.Base.Logger}
   */
  static #logger;

  /**
   * @param {AvayaClientServices.Base.Logger} logger
   */
  static set logger(logger) {
    this.#logger = logger;
  }

  /**
   * @returns {AvayaClientServices.Base.Logger} logger
   */
  static get logger() {
    return this.#logger;
  }

  static debug() {
    if (this.#logger) {
      if (arguments.length === 1) {
        this.#logger.debug.apply(
          this.#logger,
          Logger.format(LoggerTags.CLOUD_COMMUNICATION, arguments[0])
        );
      } else if (arguments[0] === LoggerTags.CLOUD_COMMUNICATION) {
        this.#logger.debug.apply(this.#logger, Logger.format(...arguments));
      } else {
        this.#logger.debug.apply(
          this.#logger,
          Logger.format(LoggerTags.CLOUD_COMMUNICATION, ...arguments)
        );
      }
    }
  }

  static trace() {
    if (this.#logger) {
      if (arguments.length === 1) {
        this.#logger.trace.apply(
          this.#logger,
          Logger.format(LoggerTags.CLOUD_COMMUNICATION, arguments[0])
        );
      } else if (arguments[0] === LoggerTags.CLOUD_COMMUNICATION) {
        this.#logger.trace.apply(this.#logger, Logger.format(...arguments));
      } else {
        this.#logger.trace.apply(
          this.#logger,
          Logger.format(LoggerTags.CLOUD_COMMUNICATION, ...arguments)
        );
      }
    }
  }

  static info() {
    if (this.#logger) {
      if (arguments.length === 1) {
        this.#logger.info.apply(
          this.#logger,
          Logger.format(LoggerTags.CLOUD_COMMUNICATION, arguments[0])
        );
      } else if (arguments[0] === LoggerTags.CLOUD_COMMUNICATION) {
        this.#logger.info.apply(this.#logger, Logger.format(...arguments));
      } else {
        this.#logger.info.apply(
          this.#logger,
          Logger.format(LoggerTags.CLOUD_COMMUNICATION, ...arguments)
        );
      }
    }
  }

  static warn() {
    if (this.#logger) {
      if (arguments.length === 1) {
        this.#logger.warn.apply(
          this.#logger,
          Logger.format(LoggerTags.CLOUD_COMMUNICATION, arguments[0])
        );
      } else if (arguments[0] === LoggerTags.CLOUD_COMMUNICATION) {
        this.#logger.warn.apply(this.#logger, Logger.format(...arguments));
      } else {
        this.#logger.warn.apply(
          this.#logger,
          Logger.format(LoggerTags.CLOUD_COMMUNICATION, ...arguments)
        );
      }
    }
  }

  static error() {
    if (this.#logger) {
      if (arguments.length === 1) {
        this.#logger.error.apply(
          this.#logger,
          Logger.format(LoggerTags.CLOUD_COMMUNICATION, arguments[0])
        );
      } else if (arguments[0] === LoggerTags.CLOUD_COMMUNICATION) {
        this.#logger.error.apply(this.#logger, Logger.format(...arguments));
      } else {
        this.#logger.error.apply(
          this.#logger,
          Logger.format(LoggerTags.CLOUD_COMMUNICATION, ...arguments)
        );
      }
    }
  }

  static fatal() {
    if (this.#logger) {
      if (arguments.length === 1) {
        this.#logger.fatal.apply(
          this.#logger,
          Logger.format(LoggerTags.CLOUD_COMMUNICATION, arguments[0])
        );
      } else if (arguments[0] === LoggerTags.CLOUD_COMMUNICATION) {
        this.#logger.fatal.apply(this.#logger, Logger.format(...arguments));
      } else {
        this.#logger.fatal.apply(
          this.#logger,
          Logger.format(LoggerTags.CLOUD_COMMUNICATION, ...arguments)
        );
      }
    }
  }

  /**
   * @public
   * @function
   * @param {Object} logger
   * @param {boolean} disableTimestamps
   * @returns {void}
   */
  static addLogger(logger, disableTimestamps = false, locale = 'en') {
    if (!logger || typeof logger.log === 'undefined') {
      throw new TypeError('Logger should implement log method.');
    }
    logger.disableTimestamps = disableTimestamps;
    this.#logger = logger;
    this.#locale = locale;
  }

  static format(...args) {
    function dateOffsetToString(offset) {
      const formatHours = function (hours) {
        let hourStr = 0;
        let sign = '-';
        const fillingZero = hours > -9 && hours < 9 ? '0' : '';

        if (hours < 0) {
          sign = '+';
          hours *= -1;
        }
        hourStr = Math.floor(hours);

        return sign + fillingZero + hourStr;
      };

      const offsetHours = offset / 60;
      const offsetHoursStr = formatHours(offsetHours);
      const offsetMinutesStr = offsetHours === parseInt(offsetHours, 10) ? '00' : '30';

      return `UTC${offsetHoursStr}:${offsetMinutesStr}`;
    }

    let loggerArguments;

    if (this.#logger.disableTimestamps) {
      const firstArgumentNoTime = `${args[0]}: ${args[1]}`;

      loggerArguments = Array.prototype.slice.call(args, 1);
      loggerArguments[0] = firstArgumentNoTime;
    } else {
      const date = new Date();
      const currentTimezoneOffset = date.getTimezoneOffset();

      if (currentTimezoneOffset !== Logger.#timezoneOffset) {
        Logger.#timezoneOffset = currentTimezoneOffset;
        Logger.#timezoneOffsetStr = dateOffsetToString(Logger.#timezoneOffset);
      }
      const firstArgumentTime = `[${date.toLocaleString(Logger.#locale)}, ${
        Logger.#timezoneOffsetStr
      }] ${args[0]}: ${args[1]}`;

      loggerArguments = Array.prototype.slice.call(args, 1);
      loggerArguments[0] = firstArgumentTime;
    }

    return loggerArguments;
  }
}

// console.log('%c refreshToken() ', 'background: #0000ff; color: #fff');

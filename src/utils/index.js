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
    if (moment(end).diff(moment(start), 'hours') === 1) {
      text = 'hour';
    } else text = 'hours';

    return `${moment(end).diff(moment(start), 'hours')} ${text}`;
  }
  if (moment(end).diff(moment(start)) > 60000 < 3600000) {
    if (moment(end).diff(moment(start), 'minutes') === 1) {
      text = 'minute';
    } else text = 'minutes';

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

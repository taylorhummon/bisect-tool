import Service from '@ember/service';
import { later, next } from '@ember/runloop';
import RSVP from 'rsvp';

export default class Utils extends Service {
  integerFromString(string) {
    if (! /^[-+]?\d+$/.test(string)) return null;
    const parsed = Number(string);
    if (isNaN(parsed) || typeof parsed !== 'number') return null;
    return parsed;
  }

  chooseIntegralMidpoint(a, b) {
    const total = a + b;
    if (this._isEven(total)) return total / 2;
    if (this._flipCoin()) {
      return (total + 1) / 2;
    } else {
      return (total - 1) / 2;
    }
  }

  _isEven(integer) {
    return integer % 2 === 0;
  }

  _flipCoin() {
    return Math.floor(2 * Math.random()) === 0;
  }

  amDone(a, b) {
    return Math.abs(a - b) <= 1;
  }

  isNullOrUndefined(a) {
    return a === null || typeof a === 'undefined';
  }

  generateUuid() {
    const template = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    const chars = template.split('');
    const digits = chars.map(char => {
      if (char === '-') {
        return '-';
      } else {
        return this._randomHexDigit();
      }
    });
    return digits.join('');
  }

  _randomHexDigit() {
    return Math.floor(Math.random() * 16).toString(16).toUpperCase();
  }

  delayPromise(waitTime) {
    return new RSVP.Promise(resolve => {
      later(resolve, waitTime);
    });
  }

  domRenderPromise() {
    return new RSVP.Promise(resolve => {
      next(null, resolve);
    });
  }

  removeMatching(array, predicate) {
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array.objectAt(i))) {
        array.removeAt(i);
      }
    }
  }
}

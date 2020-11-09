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
    let total = a + b;
    if (this._isOdd(total)) {
      if (this._flipCoin()) {
        total += 1;
      } else {
        total -= 1;
      }
    }
    return total / 2;
  }

  _isOdd(integer) {
    return integer % 2 === 1;
  }

  _flipCoin() {
    return Math.floor(2 * Math.random());
  }

  amDone(a, b) {
    return Math.abs(a - b) <= 1;
  }


  generateUuid() {
    let result = '';
    for (let j = 0; j < 32; j++) {
      if (j == 8 || j == 12 || j == 16 || j == 20) result += '-';
      result += Math.floor(Math.random() * 16).toString(16).toUpperCase();
    }
    return result;
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
}

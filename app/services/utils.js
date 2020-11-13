import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { later, next } from '@ember/runloop';
import RSVP from 'rsvp';

export default Service.extend({
  integerFromString(string) {
    if (! /^[-+]?\d+$/.test(string)) return null;
    const parsed = Number(string);
    if (isNaN(parsed) || typeof parsed !== 'number') return null;
    return parsed;
  },

  random: service(),

  chooseIntegralMidpoint(integerA, integerB) {
    const total = integerA + integerB;
    if (this._isEven(total)) return total / 2;
    if (this.random.flipCoin()) {
      return (total + 1) / 2;
    } else {
      return (total - 1) / 2;
    }
  },

  _isEven(integer) {
    return integer % 2 === 0;
  },

  isNullOrUndefined(a) {
    return a === null || typeof a === 'undefined';
  },

  generateUuid() {
    const template = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    const chars = template.split('');
    const digits = chars.map(
      char => char === '-' ? '-' : this.random.hexDigit()
    );
    return digits.join('');
  },

  delayPromise(waitTime) {
    return new RSVP.Promise(resolve => {
      later(resolve, waitTime);
    });
  },

  domRenderPromise() {
    return new RSVP.Promise(resolve => {
      next(null, resolve);
    });
  },

  removeMatching(array, predicate) {
    for (let i = array.length - 1; i >= 0; i--) {
      if (predicate(array.objectAt(i))) {
        array.removeAt(i);
      }
    }
  },
});

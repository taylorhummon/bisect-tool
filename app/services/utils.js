import Service from '@ember/service';
import { later, next } from '@ember/runloop';
import RSVP from 'rsvp';

export default class Utils extends Service {
  flipCoin() {
    return Math.floor(2 * Math.random());
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

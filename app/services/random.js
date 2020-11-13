import Service from '@ember/service';

export default Service.extend({
  flipCoin() {
    return this._randomInteger(2) === 0;
  },

  hexDigit() {
    return this._randomInteger(16).toString(16).toUpperCase();
  },

  _randomInteger(n) {
    return Math.floor(n * Math.random());
  },
});

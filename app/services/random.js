import Service from '@ember/service';

export default Service.extend({
  flipCoin() {
    return this._randomInteger(2) === 0;
  },

  _randomInteger(n) {
    return Math.floor(n * Math.random());
  },
});

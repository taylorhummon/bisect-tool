import Service from '@ember/service';

export default Service.extend({
  generateUuid() {
    const template = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
    const chars = template.split('');
    const digits = chars.map(
      char => char === '-' ? '-' : this._randomHexDigit()
    );
    return digits.join('');
  },

  _randomHexDigit() {
    return this._randomInteger(16).toString(16).toUpperCase();
  },

  _randomInteger(n) {
    return Math.floor(n * Math.random());
  },
});

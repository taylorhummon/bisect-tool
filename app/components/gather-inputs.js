import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

const MISSING_HAPPY_NUMBER = {
  name: 'missing-happy-number',
  message: 'Please enter a number for when things were good.'
};
const MISSING_SAD_NUMBER = {
  name: 'missing-sad-number',
  message: 'Please enter a number for when things were bad.'
};
const EQUAL_NUMBERS = {
  name: 'equal-numbers',
  message: 'Please enter different numbers for when things were good and bad.'
};

export default Component.extend({
  classNames: ['gather-inputs'],

  errors: null,

  init() {
    this._super(...arguments);
    this.set('errors', []);
  },

  happyValueString: null,
  sadValueString: null,
  begin: null,

  utils: service(),

  @action onBeginClick() {
    this._resetErrors();
    const happyValueInteger = this.utils.integerFromString(this.happyValueString);
    const sadValueInteger = this.utils.integerFromString(this.sadValueString);
    if (happyValueInteger === null) this.errors.pushObject(MISSING_HAPPY_NUMBER);
    if (sadValueInteger === null) this.errors.pushObject(MISSING_SAD_NUMBER);
    if (happyValueInteger === sadValueInteger && happyValueInteger !== null) {
      this.errors.pushObject(EQUAL_NUMBERS);
    }
    if (this.errors.length > 0) return;
    this.begin(happyValueInteger, sadValueInteger);
  },

  _resetErrors() {
    while (this.errors.length > 0) {
      this.errors.popObject();
    }
  },
});

import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

const MISSING_HAPPY_NUMBER = 'Please enter a number for when things were good.';
const MISSING_SAD_NUMBER = 'Please enter a number for when things were bad.';
const EQUAL_NUMBERS = 'Please enter different numbers for when things were good and bad.';

export default Component.extend({
  utils: service(),

  classNames: ['intro-gather-inputs'],

  begin: null, // closure action parameter

  errors: null, // initialized in init

  init() {
    this._super(...arguments);
    this.set('errors', []);
  },

  happyValueString: null,
  sadValueString: null,

  @action onBeginClick() {
    this._resetErrors();
    const happyValueInteger = this.utils.integerFromString(this.happyValueString);
    const sadValueInteger = this.utils.integerFromString(this.sadValueString);
    if (happyValueInteger === null) this.errors.pushObject(MISSING_HAPPY_NUMBER);
    if (sadValueInteger === null) this.errors.pushObject(MISSING_SAD_NUMBER);
    if (happyValueInteger === sadValueInteger) this.errors.pushObject(EQUAL_NUMBERS);
    if (this.errors.length > 0) return;
    this.begin(happyValueInteger, sadValueInteger);
  },

  _resetErrors() {
    while (this.errors.length > 0) {
      this.errors.popObject();
    }
  },
});

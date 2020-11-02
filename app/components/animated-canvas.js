import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';

// !!! consider making this a class
export default Component.extend({
  animation: service(),

  init() {
    this._super(...arguments);
    this.animation.setupAnimatedCanvas();
  },

  smileyGroupings: readOnly('animation.smileyGroupings'),
});

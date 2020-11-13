import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';

export default Component.extend({
  classNames: ['animation-canvas'],

  animation: service(),

  init() {
    this._super(...arguments);
    this.animation.animateSetup(); // not awaiting
  },

  groupings: readOnly('animation.groupings'),
});

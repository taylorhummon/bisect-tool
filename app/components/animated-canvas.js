import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';

// !!! consider making this a class
export default Component.extend({
  animation: service(),

  init() {
    this._super(...arguments);
    this.animation.animateSetup(); // not awaiting
  },

  groupings: readOnly('animation.groupings'), // !!!
});

import Controller from '@ember/controller';
import { action } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Controller.extend({
  animation: service(),

  isIntroDone: false,
  isBisectingDone: readOnly('animation.isBisectingDone'),

  @action begin(initialHappyInteger, initialSadInteger) {
    this.animation.set('initialSadInteger', initialSadInteger);
    this.animation.set('initialHappyInteger', initialHappyInteger);
    this.set('isIntroDone', true);
  },

  @action startOverClicked() {
    this.set('isIntroDone', false);
    this.animation.reset();
  },
});

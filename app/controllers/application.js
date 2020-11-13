import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default Controller.extend({
  animation: service(),

  isIntroDone: false,

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

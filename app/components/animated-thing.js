import Component from '@ember/component';
import move from 'ember-animated/motions/move';
import { easeOut, easeIn } from 'ember-animated/easings/cosine';

export default Component.extend({
  showThing: false,

  toggleThing() {
    this.set('showThing', !this.get('showThing'));
  },

  transition: function * ({ insertedSprites, keptSprites, removedSprites }) {
    for (let sprite of insertedSprites) {
      sprite.startAtPixel({ x: window.innerWidth });
      move(sprite, { easing: easeOut });
    }

    for (let sprite of keptSprites) {
      move(sprite);
    }

    for (let sprite of removedSprites) {
      sprite.endAtPixel({ x: window.innerWidth });
      move(sprite, { easing: easeIn });
    }
  },
});

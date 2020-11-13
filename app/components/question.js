import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import RSVP from 'rsvp';

export default Component.extend({
  animation: service(),
  registry: service(),

  classNames: ['question'],
  classNameBindings: ['opacity'],

  didInsertElement() {
    this.registry.registerComponent('question', 'the-only-question', this);
  },

  willDestroyElement() {
    this.registry.unregisterComponent('question', 'the-only-question');
  },

  opacity: 'opacity-transparent',

  integralMidpoint: readOnly('animation.integralMidpoint'),

  async fadeFromOpaqueToTransparent() {
    await this._animate('opacity', 'opaque', 'transparent');
  },

  async fadeFromTransparentToOpaque() {
    await this._animate('opacity', 'transparent', 'opaque');
  },

  _animate(attribute, from, to) {
    return new RSVP.Promise((resolve, reject) => {
      if (this.opacity !== `opacity-${from}`) { // !!!!
        reject(`Question must have ${attribute} be equal to ${from} in order to transition to ${to}`); // !!!!
        return;
      }
      const onAnimationEnd = () => {
        this.element.removeEventListener('animationend', onAnimationEnd);
        this.set(attribute, `opacity-${to}`);
        resolve();
      };
      this.element.addEventListener('animationend', onAnimationEnd);
      this.set(attribute, `opacity-from-${from}-to-${to}`);
    });
  },
});

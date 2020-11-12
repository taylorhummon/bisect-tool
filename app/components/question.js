import Component from '@ember/component';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

export default Component.extend({
  classNames: ['question'],
  classNameBindings: ['opacity'],

  opacity: 'opacity-opaque',
  integer: null,

  async fadeFromOpaqueToTransparent() {
    await this._animate('opacity', 'opaque', 'transparent');
  },

  async fadeFromTransparentToOpaque() {
    await this._animate('opacity', 'transparent', 'opaque');
  },

  _animate(attribute, from, to) {
    return new RSVP.Promise((resolve, reject) => {
      if (this.face[attribute] !== from) {
        reject(`Question must have ${attribute} be equal to ${from} in order to transition to ${to}`);
        return;
      }
      const onAnimationEnd = () => {
        this.element.removeEventListener('animationend', onAnimationEnd);
        this.face.set(attribute, to);
        resolve();
      };
      this.element.addEventListener('animationend', onAnimationEnd);
      this.face.set(attribute, `from-${from}-to-${to}`);
    });
  },
});

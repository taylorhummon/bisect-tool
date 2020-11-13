import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import RSVP from 'rsvp';

export default Component.extend({
  componentRegistry: service(),

  classNames: ['smiley-face'],
  classNameBindings: ['fill', 'opacity', 'position'],

  @action onSmileyFaceClick() {
    if (! this.onSmileyFaceClickPrime) return;
    this.onSmileyFaceClickPrime(this.face.position);
  },

  didInsertElement() {
    this.componentRegistry.registerComponent('face', this.face.id, this);
  },

  willDestroyElement() {
    this.componentRegistry.unregisterComponent('face', this.face.id);
  },

  face: null,
  onSmileyFaceClickPrime: null,

  fill: computed(
    'face.fill',
    function () {
      return `fill-${this.face.fill}`;
    }
  ),

  opacity: computed(
    'face.opacity',
    function () {
      return `opacity-${this.face.opacity}`;
    }
  ),

  async fadeFromOpaqueToTransparent() {
    await this._animate('opacity', 'opaque', 'transparent');
  },

  position: computed(
    'face.position',
    function () {
      return `position-${this.face.position}`;
    }
  ),

  async moveFromLeftToCenter() {
    await this._animate('position', 'left', 'center');
  },

  async moveFromRightToCenter() {
    await this._animate('position', 'right', 'center');
  },

  _animate(attribute, from, to) {
    return new RSVP.Promise((resolve, reject) => {
      if (this.face[attribute] !== from) {
        reject(`SmileyFace must have ${attribute} be equal to ${from} in order to transition to ${to}`);
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

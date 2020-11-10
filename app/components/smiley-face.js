import Component from '@ember/component';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

// !!! consider making this a class
// !!! consider replacing these computed properties

export default Component.extend({
  componentRegistry: service(),

  classNames: ['smiley-face'],
  classNameBindings: ['opacity', 'position'],

  @action smileyFaceClicked() { // !!! consider renaming
    if (! this.onSmileyClick) return;
    this.onSmileyClick(this.face.position);
  },

  didInsertElement() {
    this.componentRegistry.registerSmileyFaceComponent(this.face.id, this);
  },

  willDestroyElement() {
    this.componentRegistry.unregisterSmileyFaceComponent(this.face.id);
  },

  face: null,
  onSmileyClick: null,

  imageSrc: computed(
    'face.{fill,type}',
    function () {
      if (this.face.fill === 'outline') {
        if (this.face.type === 'happy') return 'smiley-face-happy.svg';
        if (this.face.type === 'sad') return 'smiley-face-sad.svg';
      }
      if (this.face.fill === 'filled') { // !!! remove this
        if (this.face.type === 'happy') return 'smiley-face-happy.svg';
        if (this.face.type === 'sad') return 'smiley-face-sad.svg';
      }
      throw 'could not find image for smiley';
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

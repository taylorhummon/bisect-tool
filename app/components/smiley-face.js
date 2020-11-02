import Component from '@ember/component';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

// !!! consider making this a class
// !!! consider replacing these computed properties

export default Component.extend({
  animation: service(),

  classNames: ['smiley-face'],
  classNameBindings: ['opacity', 'position'],

  @action smileyFaceClicked() {
    if (! this.onSmileyClick) return;
    this.onSmileyClick(this.smileyFace.type);
  },

  didInsertElement() {
    // !!! do I need to super?
    this.animation.registerSmileyFaceComponent(this.smileyFace.id, this);
  },

  // !!!! should unregister the component when being removed

  smileyFace: null,
  onSmileyClick: null, // closure action

  imageSrc: computed(
    'smileyFace.fill',
    'smileyFace.type',
    function () {
      if (this.smileyFace.fill === 'outline') {
        if (this.smileyFace.type === 'happy') return 'emoticon-happy-outline.png';
        if (this.smileyFace.type === 'sad') return 'emoticon-sad-outline.png';
      }
      if (this.smileyFace.fill === 'filled') {
        if (this.smileyFace.type === 'happy') return 'emoticon-happy.png';
        if (this.smileyFace.type === 'sad') return 'emoticon-sad.png';
      }
    }
  ),

  opacity: computed(
    'smileyFace.opacity',
    function () {
      return `opacity-${this.smileyFace.opacity}`;
    }
  ),

  async fadeFromOpaqueToTransparent() {
    await this._animate('opacity', 'opaque', 'transparent');
  },

  position: computed(
    'smileyFace.position',
    function () {
      return `position-${this.smileyFace.position}`;
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
      if (this.smileyFace[attribute] !== from) {
        reject(`SmileyFace must have ${attribute} be equal to ${from} in order to transition to ${to}`);
        return;
      }
      const onAnimationEnd = () => {
        this.element.removeEventListener('animationend', onAnimationEnd);
        this.smileyFace.set(attribute, to);
        resolve();
      };
      this.element.addEventListener('animationend', onAnimationEnd);
      this.smileyFace.set(attribute, `from-${from}-to-${to}`);
    });
  },
});

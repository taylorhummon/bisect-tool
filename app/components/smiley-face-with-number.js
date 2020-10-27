import Component from '@ember/component';
import { action } from '@ember/object';
import { alias } from '@ember/object/computed';
import { readOnly } from '@ember/object/computed';

function flipCoin() {
  return Math.floor(2 * Math.random());
}

// !!! consider making this a class
export default Component.extend({
  classNames: ['smiley-face-with-number'],
  classNameBindings: ['opacity', 'position'],

  smiley: null,

  opacity: alias('smiley.opacity'),
  position: alias('smiley.position'),

  init() {
    this._super(...arguments);
    console.log('SMILEY', this.smiley);
  },

  @action smileyFaceClicked() {
    if (this.position === 'state-center') {
      this._animateCenterToRight();
    } else {
      this._animateOpaqueToTransparent();
    }
  },

  _animateOpaqueToTransparent() {
    if (this.opacity !== 'state-opaque') return;
    const onAnimationEnd = () => {
      this.element.removeEventListener('animationend', onAnimationEnd);
      this.set('opacity', 'state-transparent');
    };
    this.element.addEventListener('animationend', onAnimationEnd);
    this.set('opacity', 'transition-opaque-to-transparent');
  },

  _animateTransparentToOpaque() {
    if (this.opacity !== 'state-transparent') return;
    const onAnimationEnd = () => {
      this.element.removeEventListener('animationend', onAnimationEnd);
      this.set('opacity', 'state-opaque');
    };
    this.element.addEventListener('animationend', onAnimationEnd);
    this.set('opacity', 'transition-transparent-to-opaque');
  },

  _animateCenterToLeft() {
    if (this.position !== 'state-center') return;
    const onAnimationEnd = () => {
      this.element.removeEventListener('animationend', onAnimationEnd);
      this.set('position', 'state-left');
    };
    this.element.addEventListener('animationend', onAnimationEnd);
    this.set('position', 'transition-center-to-left');
  },

  _animateCenterToRight() {
    if (this.position !== 'state-center') return;
    const onAnimationEnd = () => {
      this.element.removeEventListener('animationend', onAnimationEnd);
      this.set('position', 'state-right');
    };
    this.element.addEventListener('animationend', onAnimationEnd);
    this.set('position', 'transition-center-to-right');
  },
});

import Component from '@ember/component';
import { action } from '@ember/object';

function flipCoin() {
  return Math.floor(2 * Math.random());
}

// !!! consider making this a class
export default Component.extend({
  classNames: ['smiley-face-with-number'],
  classNameBindings: ['opacity', 'position'],
  opacity: 'state-opaque',
  position: 'state-center',

  @action smileyFaceClicked() {
    if (flipCoin()) { // change opacity
      if (this.opacity === 'state-opaque') {
        this._animateOpaqueToTransparent();
      } else {
        this._animateTransparentToOpaque();
      }
    } else { // change position
      if (this.position === 'state-center') {
        if (flipCoin()) {
          this._animateCenterToLeft();
        } else {
          this._animateCenterToRight();
        }
      } else {
        console.log('Setting position to center');
        this.set('position', 'state-center');
      }
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

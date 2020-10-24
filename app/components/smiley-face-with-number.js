import Component from '@ember/component';
import { action } from '@ember/object';

// !!! consider making this a class
export default Component.extend({
  classNames: ['smiley-face-with-number'],
  classNameBindings: ['stateOrTransition'],
  stateOrTransition: 'state-center',

  _onAnimationEndBound: null,

  @action smileyFaceClicked() {
    if (Math.floor(2 * Math.random())) {
      this._animateCenterToLeft();
    } else {
      this._animateCenterToRight();
    }
  },

  _animateCenterToLeft() {
    if (this.stateOrTransition !== 'state-center') return;
    const onAnimationEnd = () => {
      this.element.removeEventListener('animationend', onAnimationEnd);
      this.set('stateOrTransition', 'state-left');
    };
    this.element.addEventListener('animationend', onAnimationEnd);
    this.set('stateOrTransition', 'transition-center-to-left');
  },

  _animateCenterToRight() {
    if (this.stateOrTransition !== 'state-center') return;
    const onAnimationEnd = () => {
      this.element.removeEventListener('animationend', onAnimationEnd);
      this.set('stateOrTransition', 'state-right');
    };
    this.element.addEventListener('animationend', onAnimationEnd);
    this.set('stateOrTransition', 'transition-center-to-right');
  },
});

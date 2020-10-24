import Component from '@ember/component';
import { action } from '@ember/object';

// !!! consider making this a class
export default Component.extend({
  classNames: ['smiley-face-with-number'],
  classNameBindings: ['stateOrTransition'],
  stateOrTransition: 'state-left',

  _onAnimationEndBound: null,

  @action smileyFaceClicked() {
    console.log('CLICKED THE SMILEY');
    if (this.stateOrTransition !== 'state-left') return;
    this.set('_onAnimationEndBound', this.onAnimationEnd.bind(this));
    this.element.addEventListener('animationend', this._onAnimationEndBound);
    this.set('stateOrTransition', 'transition-left-to-right');
  },

  onAnimationEnd() {
    console.log('DONE MOVING');
    this.set('stateOrTransition', 'state-right');
    this.element.removeEventListener('animationend', this._onAnimationEndBound);
  },
});

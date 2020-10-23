import Component from '@ember/component';
import { action } from '@ember/object';

// !!! consider making this a class
export default Component.extend({
  classNames: ['smiley-face-with-number'],
  classNameBindings: ['stateOrTransition'],
  stateOrTransition: 'state-left',

  @action smileyFaceClicked() {
    console.log('CLICKED THE SMILEY');
    if (this.stateOrTransition !== 'state-left') return;
    // !!! should remove this listener at some point, too
    // !!! what was this false here again?
    this.element.addEventListener('animationend', this.onAnimationEnd.bind(this), false);
    this.set('stateOrTransition', 'transition-left-to-right');
  },

  onAnimationEnd() {
    console.log('DONE MOVING');
    this.set('stateOrTransition', 'state-right');
  },
});

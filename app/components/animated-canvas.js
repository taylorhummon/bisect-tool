import Component from '@ember/component';
import EmberObject from '@ember/object';
import { action } from '@ember/object';
import RSVP from 'rsvp';

function flipCoin() {
  return Math.floor(2 * Math.random());
}

// !!! consider making this a class
export default Component.extend({
  smilies: null,

  init() {
    console.log('IN INIT');
    this._super(...arguments);
    const initialLeftSmiley = EmberObject.create({
      id: 'id-1',
      smile: 'state-sad',
      opacity: 'state-opaque',
      position: 'state-left',
    });
    const initialCenterSmiley = EmberObject.create({
      id: 'id-2',
      smile: 'state-happy',
      opacity: 'state-opaque',
      position: 'state-center',
    });
    const initialRightSmiley = EmberObject.create({
      id: 'id-3',
      smile: 'state-happy',
      opacity: 'state-opaque',
      position: 'state-right',
    });
    const smilies = [initialLeftSmiley, initialCenterSmiley, initialRightSmiley];
    this.set('smilies', smilies);
  },

  @action async onSmileyClick(smiley) { // !!! does this need to be an action?
    if (smiley.position !== 'state-center') return;
    await this._removeSmileyByPosition('state-right');
    await this._moveSmileToRight();
    // make the right smiley disappear and remove it from the list of smilies.
    // make the center smiley move to the right.
    // make a new center smiley and make it appear
  },

  async _removeSmileyByPosition(smileyPosition) {
    const smiley = this.smilies.find(
      smiley => smiley.position === smileyPosition
    );
    if (! smiley) return;
    const domElement = this.element.querySelector(`.${smiley.id}`);
    if (! domElement) return;
    await this._animateOpaqueToTransparent(smiley, domElement);
    this._removeSmilies();
  },

  _removeSmilies() {
    for (let i = this.smilies.length - 1; i >= 0; i--) {
      const smiley = this.smilies.objectAt(i);
      if (smiley.opacity === 'state-transparent') { // !!!
        this.smilies.removeAt(i);
      }
    }
  },

  _animateOpaqueToTransparent(smiley, domElement) {
    if (smiley.opacity !== 'state-opaque') return RSVP.reject('Smiley must be opaque in order to transition from opaque to transparent');
    return new RSVP.Promise((resolve, reject) => {
      const onAnimationEnd = () => {
        domElement.removeEventListener('animationend', onAnimationEnd);
        smiley.set('opacity', 'state-transparent');
        resolve();
      };
      domElement.addEventListener('animationend', onAnimationEnd);
      smiley.set('opacity', 'transition-opaque-to-transparent');
    });
  },

  async _moveSmileToRight() {
    const smiley = this.smilies.find(
      smiley => smiley.position === 'state-center'
    );
    if (! smiley) return;
    const domElement = this.element.querySelector(`.${smiley.id}`);
    if (! domElement) return;
    await this._animateCenterToRight(smiley, domElement);
  },

  _animateCenterToRight(smiley, domElement) {
    if (smiley.position !== 'state-center') return RSVP.reject('Smiley must be centered in order to transition from center to right');
    return new RSVP.Promise((resolve, reject) => {
      const onAnimationEnd = () => {
        domElement.removeEventListener('animationend', onAnimationEnd);
        smiley.set('position', 'state-right');
        resolve();
      };
      domElement.addEventListener('animationend', onAnimationEnd);
      smiley.set('position', 'transition-center-to-right');
    });
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
});

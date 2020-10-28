import Component from '@ember/component';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import RSVP from 'rsvp';

// !!! consider making this a class
export default Component.extend({
  smilies: null,

  utils: service(),

  init() {
    console.log('IN INIT');
    this._super(...arguments);
    const initialLeftSmiley = EmberObject.create({
      id: this.utils.generateUuid(),
      smile: 'state-sad',
      opacity: 'state-opaque',
      position: 'state-left',
    });
    const initialCenterSmiley = EmberObject.create({
      id: this.utils.generateUuid(),
      smile: 'state-happy',
      opacity: 'state-opaque',
      position: 'state-center',
    });
    const initialRightSmiley = EmberObject.create({
      id: this.utils.generateUuid(),
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
    await this._moveSmileyToRight();
    await this._createCenterSmiley();
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
    return new RSVP.Promise(resolve => {
      const onAnimationEnd = () => {
        domElement.removeEventListener('animationend', onAnimationEnd);
        smiley.set('opacity', 'state-transparent');
        resolve();
      };
      domElement.addEventListener('animationend', onAnimationEnd);
      smiley.set('opacity', 'transition-opaque-to-transparent');
    });
  },

  async _moveSmileyToRight() {
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
    return new RSVP.Promise(resolve => {
      const onAnimationEnd = () => {
        domElement.removeEventListener('animationend', onAnimationEnd);
        smiley.set('position', 'state-right');
        resolve();
      };
      domElement.addEventListener('animationend', onAnimationEnd);
      smiley.set('position', 'transition-center-to-right');
    });
  },

  async _createCenterSmiley() {
    const centerSmiley = EmberObject.create({
      id: this.utils.generateUuid(),
      smile: 'state-happy',
      opacity: 'state-transparent',
      position: 'state-center',
    });
    this.smilies.pushObject(centerSmiley);
    console.log('SMILY PUSHED', this.smilies);
    await this.utils.delayPromise(0); // !!! ugh
    const selectorString = `.${centerSmiley.id}`;
    console.log('SELECTOR STRING', selectorString);
    const domElement = this.element.querySelector(`.${centerSmiley.id}`); // !!! is the smiley in the dom already?
    console.log('IS THERE A DOM ELEMENT', domElement);
    this._animateTransparentToOpaque(centerSmiley, domElement);
  },

  _animateTransparentToOpaque(smiley, domElement) {
    if (smiley.opacity !== 'state-transparent') return RSVP.reject('Smiley must be transparent in order to transition from transparent to opaque');
    return new RSVP.Promise(resolve => {
      const onAnimationEnd = () => {
        domElement.removeEventListener('animationend', onAnimationEnd);
        smiley.set('opacity', 'state-opaque');
        resolve();
      };
      domElement.addEventListener('animationend', onAnimationEnd);
      smiley.set('opacity', 'transition-transparent-to-opaque');
    });
  },

  _animateCenterToLeft(smiley, domElement) {
    if (smiley.position !== 'state-center') return;
    const onAnimationEnd = () => {
      domElement.removeEventListener('animationend', onAnimationEnd);
      smiley.set('position', 'state-left');
    };
    domElement.addEventListener('animationend', onAnimationEnd);
    smiley.set('position', 'transition-center-to-left');
  },
});

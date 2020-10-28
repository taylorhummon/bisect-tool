import Component from '@ember/component';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import RSVP from 'rsvp';

// !!! consider making this a class
export default Component.extend({
  utils: service(),

  smilies: null,

  init() {
    this._super(...arguments);
    const smilies = [
      this._buildSmiley('state-sad', 'state-opaque', 'state-left'),
      this._buildSmiley('state-happy', 'state-opaque', 'state-center'),
      this._buildSmiley('state-happy', 'state-opaque', 'state-right'),
    ];
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
    await this._animateOpaqueToTransparent(smiley);
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

  _animateOpaqueToTransparent(smiley) {
    if (smiley.opacity !== 'state-opaque') return RSVP.reject('Smiley must be opaque in order to transition from opaque to transparent');
    const domElement = this._domElementForSmiley(smiley);
    if (! domElement) return RSVP.reject('Could not find dom element');
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
    await this._animateCenterToRight(smiley);
  },

  _animateCenterToRight(smiley) {
    if (smiley.position !== 'state-center') return RSVP.reject('Smiley must be centered in order to transition from center to right');
    const domElement = this._domElementForSmiley(smiley);
    if (! domElement) return RSVP.reject('Could not find dom element');
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
    const smiley = this._buildSmiley('state-happy', 'state-transparent', 'state-center');
    this.smilies.pushObject(smiley);
    await this.utils.delayPromise(0); // !!! ugh
    this._animateTransparentToOpaque(smiley);
  },

  _animateTransparentToOpaque(smiley) {
    if (smiley.opacity !== 'state-transparent') return RSVP.reject('Smiley must be transparent in order to transition from transparent to opaque');
    const domElement = this._domElementForSmiley(smiley);
    if (! domElement) return RSVP.reject('Could not find dom element');
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

  _animateCenterToLeft(smiley) {
    if (smiley.position !== 'state-center') return RSVP.reject('Smiley must be centered in order to transition from center to left');
    const domElement = this._domElementForSmiley(smiley);
    return new RSVP.Promise(resolve => {
      const onAnimationEnd = () => {
        domElement.removeEventListener('animationend', onAnimationEnd);
        smiley.set('position', 'state-left');
        resolve();
      };
      domElement.addEventListener('animationend', onAnimationEnd);
      smiley.set('position', 'transition-center-to-left');
    });
  },

  _buildSmiley(smile, opacity, position) {
    const id = this.utils.generateUuid();
    return EmberObject.create({ id, smile, opacity, position });
  },

  _domElementForSmiley(smiley) {
    return this.element.querySelector(`.${smiley.id}`); // !!! this is gross
  },
});

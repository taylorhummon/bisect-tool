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
      this._buildSmiley('state-choice', 'state-opaque', 'state-center'),
      this._buildSmiley('state-happy', 'state-opaque', 'state-right'),
    ];
    this.set('smilies', smilies);
  },

  @action async onSmileyClick(decision) { // !!! does this need to be an action?
    await this._animateDecision(decision);
    const direction = decision === 'happy' ? 'right' : 'left'; !!!!!
    await this._rearrangeSmilies(direction); // !!!!!
  },

  async _animateDecision(decision) {
    if (decision === 'sad') {
      const smiley = this.smilies.find(
        smiley => smiley.position === 'state-center'
      );
      smiley.set('rightChoiceOpacity', 'transition-from-opaque-to-transparent');
      smiley.set('leftChoicePosition', 'transition-from-left-to-center');
      await this.utils.delayPromise(600); // !!!! hacky
      smiley.set('rightChoiceOpacity', 'state-transparent');
      smiley.set('leftChoicePosition', 'state-center');
      smiley.set('smile', 'state-sad');
      return;
    }
    if (decision === 'happy') {
      const smiley = this.smilies.find(
        smiley => smiley.position === 'state-center'
      );
      smiley.set('leftChoiceOpacity', 'transition-from-opaque-to-transparent');
      smiley.set('rightChoicePosition', 'transition-from-right-to-center');
      await this.utils.delayPromise(600); // !!!! hacky
      smiley.set('leftChoiceOpacity', 'state-transparent');
      smiley.set('rightChoicePosition', 'state-center');
      smiley.set('smile', 'state-happy');
      return;
    }
  },

  __animate(smiley, domElement, attribute, from, to) {
    return new RSVP.Promise(resolve => {
      const onAnimationEnd = () => {
        domElement.removeEventListener('animationend', onAnimationEnd);
        smiley.set(attribute, `state-${to}`);
        resolve();
      };
      domElement.addEventListener('animationend', onAnimationEnd);
      smiley.set(attribute, `transition-from-${from}-to-${to}`);
    });
  },

  async _rearrangeSmilies(direction) {
    const oldSmiley = this._oldSmiley(direction);
    const movingSmiley = this._movingSmiley();
    const newSmiley = this._newSmiley();
    await this.utils.domRenderPromise(); // !!! ugh
    await RSVP.all([
      this._animateHide(oldSmiley),
      this._animateMove(movingSmiley, direction),
      this._animateShow(newSmiley),
    ]);
    this._removeSmiley(oldSmiley);
  },

  _oldSmiley(direction) {
    const desiredPosition = `state-${direction}`;
    const smiley = this.smilies.find(
      smiley => smiley.position === desiredPosition
    );
    if (! smiley) throw 'Could not find old smiley';
    return smiley;
  },

  _movingSmiley() {
    const smiley = this.smilies.find(
      smiley => smiley.position === 'state-center'
    );
    if (! smiley) throw 'Could not find moving smiley';
    return smiley;
  },

  _newSmiley() {
    const smiley = this._buildSmiley('state-choice', 'state-transparent', 'state-center');
    this.smilies.pushObject(smiley);
    return smiley;
  },

  _buildSmiley(smile, opacity, position) {
    const id = this.utils.generateUuid();
    return EmberObject.create({
      id,
      smile,
      opacity,
      position,
      leftChoiceOpacity: 'state-opaque',
      leftChoicePosition: 'state-left',
      rightChoiceOpacity: 'state-opaque',
      rightChoicePosition: 'state-right',
    });
  },

  async _animateHide(oldSmiley) {
    await this._animate(oldSmiley, 'opacity', 'opaque', 'transparent');
  },

  async _animateMove(movingSmiley, direction) {
    await this.utils.delayPromise(300);
    await this._animate(movingSmiley, 'position', 'center', direction);
  },

  async _animateShow(newSmiley) {
    await this.utils.delayPromise(600);
    await this._animate(newSmiley, 'opacity', 'transparent', 'opaque');
  },

  _animate(smiley, attribute, from, to) {
    if (smiley[attribute] !== `state-${from}`) {
      return RSVP.reject(`Smiley must have ${attribute} be equal to state-${from} in order to transition to state-${to}`);
    }
    const domElement = this._domElementForSmiley(smiley);
    return new RSVP.Promise(resolve => {
      const onAnimationEnd = () => {
        domElement.removeEventListener('animationend', onAnimationEnd);
        smiley.set(attribute, `state-${to}`);
        resolve();
      };
      domElement.addEventListener('animationend', onAnimationEnd);
      smiley.set(attribute, `transition-from-${from}-to-${to}`);
    });
  },

  _domElementForSmiley(smiley) {
    return this.element.querySelector(`.${smiley.id}`); // !!! this is gross
  },

  _removeSmiley(oldSmiley) {
    for (let i = this.smilies.length - 1; i >= 0; i--) {
      const smiley = this.smilies.objectAt(i);
      if (smiley.id === oldSmiley.id) this.smilies.removeAt(i);
    }
  },
});

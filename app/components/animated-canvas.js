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
      this._buildSmiley('sad', 'opaque', 'left'),
      this._buildSmiley('choice', 'opaque', 'center'),
      this._buildSmiley('happy', 'opaque', 'right'),
    ];
    this.set('smilies', smilies);
  },

  @action async onSmileyClick(decision) { // !!! does this need to be an action?
    await this._animateDecision(decision);
    await this._rearrangeSmilies(decision);
  },

  async _animateDecision(decision) {
    if (decision === 'sad') {
      const smiley = this.smilies.find(
        smiley => smiley.position === 'center'
      );
      smiley.set('happyChoiceOpacity', 'from-opaque-to-transparent');
      smiley.set('sadChoicePosition', 'from-left-to-center');
      await this.utils.delayPromise(600); // !!!! hacky
      smiley.set('happyChoiceOpacity', 'transparent');
      smiley.set('sadChoicePosition', 'center');
      smiley.set('smile', 'sad');
      return;
    }
    if (decision === 'happy') {
      const smiley = this.smilies.find(
        smiley => smiley.position === 'center'
      );
      smiley.set('sadChoiceOpacity', 'from-opaque-to-transparent');
      smiley.set('happyChoicePosition', 'from-right-to-center');
      await this.utils.delayPromise(600); // !!!! hacky
      smiley.set('sadChoiceOpacity', 'transparent');
      smiley.set('happyChoicePosition', 'center');
      smiley.set('smile', 'happy');
      return;
    }
  },

  async _rearrangeSmilies(decision) {
    const direction = decision === 'happy' ? 'right' : 'left';
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
    const smiley = this.smilies.find(
      smiley => smiley.position === direction
    );
    if (! smiley) throw 'Could not find old smiley';
    return smiley;
  },

  _movingSmiley() {
    const smiley = this.smilies.find(
      smiley => smiley.position === 'center'
    );
    if (! smiley) throw 'Could not find moving smiley';
    return smiley;
  },

  _newSmiley() {
    const smiley = this._buildSmiley('choice', 'transparent', 'center');
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
      fill: 'filled',
      sadChoiceOpacity: 'opaque',
      sadChoicePosition: 'left',
      happyChoiceOpacity: 'opaque',
      happyChoicePosition: 'right',
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
    if (smiley[attribute] !== from) {
      return RSVP.reject(`Smiley must have ${attribute} be equal to ${from} in order to transition to ${to}`);
    }
    const domElement = this._domElementForSmiley(smiley);
    return new RSVP.Promise(resolve => {
      const onAnimationEnd = () => {
        domElement.removeEventListener('animationend', onAnimationEnd);
        smiley.set(attribute, `${to}`);
        resolve();
      };
      domElement.addEventListener('animationend', onAnimationEnd);
      smiley.set(attribute, `from-${from}-to-${to}`);
    });
  },

  _domElementForSmiley(smiley) {
    return this.element.querySelector(`.id-${smiley.id}`);
  },

  _removeSmiley(oldSmiley) {
    for (let i = this.smilies.length - 1; i >= 0; i--) {
      const smiley = this.smilies.objectAt(i);
      if (smiley.id === oldSmiley.id) this.smilies.removeAt(i);
    }
  },
});

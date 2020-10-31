import Component from '@ember/component';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import RSVP from 'rsvp';

// !!! consider making this a class
export default Component.extend({
  utils: service(),

  smileyGroupings: null,

  init() {
    this._super(...arguments);
    const smileyGroupings = [
      this._buildSmileyGrouping('sad', 'opaque', 'left'),
      this._buildSmileyGrouping('choice', 'opaque', 'center'),
      this._buildSmileyGrouping('happy', 'opaque', 'right'),
    ];
    this.set('smileyGroupings', smileyGroupings);
  },

  @action async onSmileyClick(decision) { // !!! does this need to be an action?
    await this._animateDecision(decision);
    await this._rearrangeSmilies(decision);
  },

  async _rearrangeSmilies(decision) {
    const direction = decision === 'happy' ? 'right' : 'left';
    const oldSmileyGrouping = this._oldSmileyGrouping(direction);
    const movingSmileyGrouping = this._movingSmileyGrouping();
    const newSmileyGrouping = this._newSmileyGrouping();
    await this.utils.domRenderPromise(); // !!! ugh
    await RSVP.all([
      this._animateHide(oldSmileyGrouping),
      this._animateMove(movingSmileyGrouping, direction),
      this._animateShow(newSmileyGrouping),
    ]);
    this._removeSmileyGrouping(oldSmileyGrouping);
  },

  _oldSmileyGrouping(direction) {
    const smileyGrouping = this.smileyGroupings.find(
      smileyGrouping => smileyGrouping.position === direction
    );
    if (! smileyGrouping) throw 'Could not find old smileyGrouping';
    return smileyGrouping;
  },

  _movingSmileyGrouping() {
    const smileyGrouping = this.smileyGroupings.find(
      smileyGrouping => smileyGrouping.position === 'center'
    );
    if (! smileyGrouping) throw 'Could not find moving smiley';
    return smileyGrouping;
  },

  _newSmileyGrouping() {
    const smileyGrouping = this._buildSmileyGrouping('choice', 'transparent', 'center');
    this.smileyGroupings.pushObject(smileyGrouping);
    return smileyGrouping;
  },

  _buildSmileyGrouping(type, opacity, position) {
    const id = this.utils.generateUuid();
    return EmberObject.create({
      id,
      type,
      opacity,
      position,
      fill: 'filled',
      sadChoiceOpacity: 'opaque',
      sadChoicePosition: 'left',
      happyChoiceOpacity: 'opaque',
      happyChoicePosition: 'right',
    });
  },

  async _animateHide(oldSmileyGrouping) {
    await this._animate(oldSmileyGrouping, 'opacity', 'opaque', 'transparent');
  },

  async _animateMove(movingSmileyGrouping, direction) {
    await this.utils.delayPromise(300);
    await this._animate(movingSmileyGrouping, 'position', 'center', direction);
  },

  async _animateShow(newSmileyGrouping) {
    await this.utils.delayPromise(600);
    await this._animate(newSmileyGrouping, 'opacity', 'transparent', 'opaque');
  },

  _animate(smileyGrouping, attribute, from, to) {
    if (smileyGrouping[attribute] !== from) {
      return RSVP.reject(`SmileyGrouping must have ${attribute} be equal to ${from} in order to transition to ${to}`);
    }
    const domElement = this._domElementForSmileyGrouping(smileyGrouping);
    return new RSVP.Promise(resolve => {
      const onAnimationEnd = () => {
        domElement.removeEventListener('animationend', onAnimationEnd);
        smileyGrouping.set(attribute, `${to}`);
        resolve();
      };
      domElement.addEventListener('animationend', onAnimationEnd);
      smileyGrouping.set(attribute, `from-${from}-to-${to}`);
    });
  },

  _domElementForSmiley(smileyGrouping) {
    return this.element.querySelector(`.id-${smileyGrouping.id}`);
  },

  _removeSmileyGrouping(oldSmileyGrouping) {
    for (let i = this.smileyGroupings.length - 1; i >= 0; i--) {
      const smileyGrouping = this.smileyGroupings.objectAt(i);
      if (smileyGrouping.id === oldSmileyGrouping.id) this.smileyGroupings.removeAt(i);
    }
  },
});

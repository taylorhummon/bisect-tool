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

  async _createCenterSmiley() {
    const smiley = this._buildSmiley('state-happy', 'state-transparent', 'state-center');
    this.smilies.pushObject(smiley);
    await this.utils.delayPromise(0); // !!! ugh
    await this._animate(smiley, 'opacity', 'transparent', 'opaque');
  },

  async _removeSmileyByPosition(smileyPosition) {
    const smiley = this.smilies.find(
      smiley => smiley.position === smileyPosition
    );
    if (! smiley) return;
    await this._animate(smiley, 'opacity', 'opaque', 'transparent');
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

  async _moveSmileyToRight() {
    const smiley = this.smilies.find(
      smiley => smiley.position === 'state-center'
    );
    if (! smiley) return;
    await this._animate(smiley, 'position', 'center', 'right');
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

  _buildSmiley(smile, opacity, position) {
    const id = this.utils.generateUuid();
    return EmberObject.create({ id, smile, opacity, position });
  },

  _domElementForSmiley(smiley) {
    return this.element.querySelector(`.${smiley.id}`); // !!! this is gross
  },
});

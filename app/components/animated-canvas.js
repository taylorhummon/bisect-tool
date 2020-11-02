import Component from '@ember/component';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import RSVP from 'rsvp';

// !!! consider making this a class
export default Component.extend({
  animation: service(),
  utils: service(),

  // @action async onSmileyClick(decision) { // !!! does this need to be an action?
  //   await this._animateDecision(decision);
  //   await this._rearrangeSmilies(decision);
  // },

  smileyGroupings: readOnly('animation.smileyGroupings'),

  init() {
    this._super(...arguments);
    this.smileyGroupings.pushObject(this._buildSmileyGrouping('sad', 'opaque', 'left'));
    this.smileyGroupings.pushObject(this._buildSmileyGrouping('choice', 'opaque', 'center'));
    this.smileyGroupings.pushObject(this._buildSmileyGrouping('happy', 'opaque', 'right'));
  },

  _buildSmileyGrouping(type, opacity, position) {
    return EmberObject.create({
      id: this.utils.generateUuid(),
      type, // !!!! do I want type? If so, what are the values?
      opacity,
      position,
      smileyFaces: this._buildSmileyFaces(type)
    });
  },

  _buildSmileyFaces(type) {
    if (type === 'happy') {
      return [
        EmberObject.create({
          id: this.utils.generateUuid(),
          type: 'happy',
          fill: 'filled',
          position: 'center',
          opacity: 'opaque',
        })
      ];
    }
    if (type === 'sad') {
      return [
        EmberObject.create({
          id: this.utils.generateUuid(),
          type: 'sad',
          fill: 'filled',
          position: 'center',
          opacity: 'opaque',
        })
      ];
    }
    if (type === 'choice') {
      return [
        EmberObject.create({
          id: this.utils.generateUuid(),
          type: 'sad',
          fill: 'outline',
          position: 'left',
          opacity: 'opaque',
        }),
        EmberObject.create({
          id: this.utils.generateUuid(),
          type: 'happy',
          fill: 'outline',
          position: 'right',
          opacity: 'opaque',
        }),
      ];
    }
  },
});

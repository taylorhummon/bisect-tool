import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import RSVP from 'rsvp';

// !!! consider making this a class
// !!! consider replacing these computed properties

export default Component.extend({
  animation: service(),

  @action smileyFaceClicked(decision) {
    if (this.smileyGrouping.type !== 'choice') return;
    this.animation.animate(decision); // not awaiting
  },

  classNames: ['smiley-grouping'],
  classNameBindings: ['opacity', 'position'],

  didInsertElement() {
    this.animation.registerSmileyGroupingComponent(this.smileyGrouping.id, this);
  },

  smileyGrouping: null,
  onSmileyClick: null, // closure action

  opacity: computed(
    'smileyGrouping.opacity',
    function () {
      return `opacity-${this.smileyGrouping.opacity}`;
    }
  ),

  async fadeFromOpaqueToTransparent() {
    await this._animate('opacity', 'opaque', 'transparent');
  },

  async fadeFromTransparentToOpaque() {
    await this._animate('opacity', 'transparent', 'opaque');
  },

  position: computed(
    'smileyGrouping.position',
    function () {
      return `position-${this.smileyGrouping.position}`;
    }
  ),

  async moveFromCenterToRight() {
    await this._animate('position', 'center', 'right');
  },

  async moveFromCenterToLeft() {
    await this._animate('position', 'center', 'left');
  },

  _animate(attribute, from, to) {
    return new RSVP.Promise((resolve, reject) => {
      if (this.smileyGrouping[attribute] !== from) {
        reject(`SmileyGrouping must have ${attribute} be equal to ${from} in order to transition to ${to}`);
        return;
      }
      const onAnimationEnd = () => {
        this.element.removeEventListener('animationend', onAnimationEnd);
        this.smileyGrouping.set(attribute, to);
        resolve();
      };
      this.element.addEventListener('animationend', onAnimationEnd);
      this.smileyGrouping.set(attribute, `from-${from}-to-${to}`);
    });
  },
});

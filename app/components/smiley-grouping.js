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
  utils: service(),

  smileyGrouping: null,
  onSmileyClick: null, // closure action

  init() {
    this._super(...arguments);
    const integer = this.smileyGrouping.integer;
    if (! this.utils.isNullOrUndefined(integer)) {
      this.set('valueString', integer.toString());
    }
  },

  valueString: null,

  valueInteger: computed(
    'valueString',
    function () {
      if (! /^[-+]?\d+$/.test(this.valueString)) return null;
      const value = Number(this.valueString);
      if (isNaN(value) || typeof value !== 'number') return null;
      return value;
    }
  ),

  doesValueStringParse: computed(
    'valueInteger',
    function () {
      return this.valueInteger !== null;
    }
  ),

  isValueReadOnly: true,

  @action smileyFaceClicked(decision) {
    if (this.smileyGrouping.position !== 'center') return;
    this.animation.animateDecision(decision); // not awaiting
  },

  classNames: ['smiley-grouping'],
  classNameBindings: ['opacity', 'position'],

  didInsertElement() {
    this.animation.registerSmileyGroupingComponent(this.smileyGrouping.id, this);
  },

  willDestroyElement() {
    this.animation.unregisterSmileyGroupingComponent(this.smileyGrouping.id);
  },

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

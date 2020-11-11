import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import RSVP from 'rsvp';

export default Component.extend({
  componentRegistry: service(),
  animation: service(),

  grouping: null,
  onSmileyClick: null,

  @action smileyFaceClicked(decision) {
    if (this.grouping.position !== 'center') return;
    this.animation.animateDecision(decision); // not awaiting
  },

  classNames: ['smiley-grouping'],
  classNameBindings: ['opacity', 'position'],

  didInsertElement() {
    this.componentRegistry.registerSmileyGroupingComponent(this.grouping.id, this);
  },

  willDestroyElement() {
    this.componentRegistry.unregisterSmileyGroupingComponent(this.grouping.id);
  },

  opacity: computed(
    'grouping.opacity',
    function () {
      return `opacity-${this.grouping.opacity}`;
    }
  ),

  async fadeFromTransparentToOpaque() {
    await this._animate('opacity', 'transparent', 'opaque');
  },

  position: computed(
    'grouping.position',
    function () {
      return `position-${this.grouping.position}`;
    }
  ),

  async moveFromCenterToRight() {
    await this._animate('position', 'center', 'right');
  },

  async moveFromRightToFarRight() {
    await this._animate('position', 'right', 'far-right');
  },

  async moveFromCenterToLeft() {
    await this._animate('position', 'center', 'left');
  },

  async moveFromLeftToFarLeft() {
    await this._animate('position', 'left', 'far-left');
  },

  _animate(attribute, from, to) {
    return new RSVP.Promise((resolve, reject) => {
      if (this.grouping[attribute] !== from) {
        reject(`SmileyGrouping must have ${attribute} be equal to ${from} in order to transition to ${to}`);
        return;
      }
      const onAnimationEnd = () => {
        this.element.removeEventListener('animationend', onAnimationEnd);
        this.grouping.set(attribute, to);
        resolve();
      };
      this.element.addEventListener('animationend', onAnimationEnd);
      this.grouping.set(attribute, `from-${from}-to-${to}`);
    });
  },
});

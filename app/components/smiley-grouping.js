import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import AnimatedComponentMixin from 'bisect-tool/mixins/animated-component'

export default Component.extend(AnimatedComponentMixin, {
  classNames: ['smiley-grouping'],
  classNameBindings: ['opacity', 'position'],

  objectName: 'grouping',
  grouping: null,

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

  async moveFromRightToFarRight() {
    await this._animate('position', 'right', 'far-right');
  },

  async moveFromCenterToRight() {
    await this._animate('position', 'center', 'right');
  },

  async moveFromCenterToLeft() {
    await this._animate('position', 'center', 'left');
  },

  async moveFromLeftToFarLeft() {
    await this._animate('position', 'left', 'far-left');
  },

  animation: service(),

  @action async onSmileyFaceClickPrime(decision) {
    if (this.grouping.position !== 'center') return;
    await this.animation.animateDecision(decision);
  },
});

import Component from '@ember/component';
import { computed } from '@ember/object';
import AnimatedComponentMixin from 'bisect-tool/mixins/animated-component';

export default Component.extend(AnimatedComponentMixin, {
  classNames: ['question'],
  classNameBindings: ['opacity'],

  objectName: 'question',
  question: null,

  opacity: computed(
    'isReady',
    'question.opacity',
    function () {
      if (! this.isReady) return 'opacity-transparent';
      return `opacity-${this.question.opacity}`;
    }
  ),

  async fadeFromOpaqueToTransparent() {
    await this._animate('opacity', 'opaque', 'transparent');
  },

  async fadeFromTransparentToOpaque() {
    await this._animate('opacity', 'transparent', 'opaque');
  },

  isReady: computed(
    'question.{integer,opacity}',
    function () {
      if (! this.question) return false;
      if (! this.question.opacity) return false;
      if (typeof this.question.integer !== 'number') return false;
      return true;
    }
  ),
});

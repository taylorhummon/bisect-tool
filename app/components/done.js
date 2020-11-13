import Component from '@ember/component';
import { computed } from '@ember/object';
import AnimatedComponentMixin from 'bisect-tool/mixins/animated-component';

export default Component.extend(AnimatedComponentMixin, {
  classNames: ['done'],
  classNameBindings: ['opacity'],

  objectName: 'done',
  done: null,

  opacity: computed(
    'done.opacity',
    function () {
      if (! this.done || ! this.done.opacity) return 'opacity-transparent';
      return `opacity-${this.done.opacity}`;
    }
  ),

  async fadeFromTransparentToOpaque() {
    await this._animate('opacity', 'transparent', 'opaque');
  },
});

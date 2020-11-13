import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import AnimatedComponentMixin from 'bisect-tool/mixins/animated-component'

export default Component.extend(AnimatedComponentMixin, {
  classNames: ['smiley-face'],
  classNameBindings: ['fill', 'opacity', 'position'],

  objectName: 'face',
  face: null,

  fill: computed(
    'face.fill',
    function () {
      return `fill-${this.face.fill}`;
    }
  ),

  opacity: computed(
    'face.opacity',
    function () {
      return `opacity-${this.face.opacity}`;
    }
  ),

  async fadeFromOpaqueToTransparent() {
    await this._animate('opacity', 'opaque', 'transparent');
  },

  position: computed(
    'face.position',
    function () {
      return `position-${this.face.position}`;
    }
  ),

  async moveFromRightToCenter() {
    await this._animate('position', 'right', 'center');
  },

  async moveFromLeftToCenter() {
    await this._animate('position', 'left', 'center');
  },

  onSmileyFaceClickPrime: null,

  @action async onSmileyFaceClick() {
    if (! this.onSmileyFaceClickPrime) return;
    await this.onSmileyFaceClickPrime(this.face.position);
  },
});

import Component from '@ember/component';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

// !!! consider making this a class
// !!! consider replacing these computed properties

export default Component.extend({
  classNames: ['smiley-face'],
  classNameBindings: ['smileId', 'opacity', 'position'],

  @action smileyFaceClicked() {
    if (! this.onSmileyClick) return;
    this.onSmileyClick(this.smileyFace.type);
  },

  smileyFace: null,
  onSmileyClick: null, // closure action

  smileyFaceId: computed(
    'smileyFace.id',
    function () {
      return `id-${this.smileyFace.id}`;
    }
  ),

  // smile: computed( // !!!!
  //   'smileyFace.type',
  //   function () {
  //     return `smile-${this.smileyFace.type}`;
  //   }
  // ),

  imageSrc: computed(
    'smileyFace.fill',
    'smileyFace.type',
    function () {
      if (this.smileyFace.fill === 'outline') {
        if (this.smileyFace.type === 'happy') return 'emoticon-happy-outline.png';
        if (this.smileyFace.type === 'sad') return 'emoticon-sad-outline.png';
      }
      if (this.smileyFace.fill === 'filled') {
        if (this.smileyFace.type === 'happy') return 'emoticon-happy.png';
        if (this.smileyFace.type === 'sad') return 'emoticon-sad.png';
      }
    }
  ),

  opacity: computed(
    'smileyFace.opacity',
    function () {
      return `opacity-${this.smileyFace.opacity}`;
    }
  ),

  position: computed(
    'smileyFace.position',
    function () {
      return `position-${this.smileyFace.position}`;
    }
  ),
});

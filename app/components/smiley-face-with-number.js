import Component from '@ember/component';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

// !!! consider making this a class
// !!! consider replacing these computed properties

export default Component.extend({
  classNames: ['smiley-face-with-number'],
  classNameBindings: ['smileId', 'opacity', 'position'],

  @action smileyFaceClicked(decision) {
    if (! this.onSmileyClick) return;
    this.onSmileyClick(decision);
  },

  smiley: null,
  onSmileyClick: null, // closure action

  smileId: computed(
    'smiley.id',
    function () {
      return `id-${this.smiley.id}`;
    }
  ),

  smile: computed(
    'smiley.smile',
    function () {
      return `smile-${this.smiley.smile}`;
    }
  ),

  opacity: computed(
    'smiley.opacity',
    function () {
      return `opacity-${this.smiley.opacity}`;
    }
  ),

  position: computed(
    'smiley.position',
    function () {
      return `position-${this.smiley.position}`;
    }
  ),

  sadChoiceOpacity: computed(
    'smiley.sadChoiceOpacity',
    function () {
      return `opacity-${this.smiley.sadChoiceOpacity}`;
    }
  ),

  sadChoicePosition: computed(
    'smiley.sadChoicePosition',
    function () {
      return `position-${this.smiley.sadChoicePosition}`;
    }
  ),

  happyChoiceOpacity: computed(
    'smiley.happyChoiceOpacity',
    function () {
      return `opacity-${this.smiley.happyChoiceOpacity}`;
    }
  ),

  happyChoicePosition: computed(
    'smiley.happyChoicePosition',
    function () {
      return `position-${this.smiley.happyChoicePosition}`;
    }
  ),
});

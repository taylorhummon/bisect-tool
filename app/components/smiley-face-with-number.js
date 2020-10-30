import Component from '@ember/component';
import { action } from '@ember/object';
import { readOnly } from '@ember/object/computed';

// !!! consider making this a class
export default Component.extend({
  smiley: null,
  onSmileyClick: null, // closure action

  smileId: readOnly('smiley.id'),
  smile: readOnly('smiley.smile'),
  opacity: readOnly('smiley.opacity'),
  position: readOnly('smiley.position'),
  leftChoiceOpacity: readOnly('smiley.leftChoiceOpacity'),
  leftChoicePosition: readOnly('smiley.leftChoicePosition'),
  rightChoiceOpacity: readOnly('smiley.rightChoiceOpacity'),
  rightChoicePosition: readOnly('smiley.rightChoicePosition'),

  classNames: ['smiley-face-with-number'],
  classNameBindings: ['smileId', 'opacity', 'position'],

  @action smileyFaceClicked(decision) {
    if (! this.onSmileyClick) return;
    this.onSmileyClick(decision);
  },
});

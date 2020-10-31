import Component from '@ember/component';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';

// !!! consider making this a class
// !!! consider replacing these computed properties

export default Component.extend({
  utils: service(),

  classNames: ['smiley-grouping'],
  classNameBindings: ['smileId', 'opacity', 'position'],

  @action smileyFaceClicked(decision) {
    console.log('SMILEY FACE CLICKED', decision);
    this._animateDecision(decision); // !!!! should await?
    // if (! this.onSmileyClick) return;
    // this.onSmileyClick(decision);
  },

  async _animateDecision(decision) {
    if (decision === 'sad') {
      this.happyChoice.set('opacity', 'from-opaque-to-transparent');
      this.sadChoice.set('position', 'from-left-to-center');
      await this.utils.delayPromise(600); // !!!! hacky
      this.happyChoice.set('opacity', 'transparent');
      this.sadChoice.set('position', 'center');
      return;
    }
    if (decision === 'happy') {
      this.sadChoice.set('opacity', 'from-opaque-to-transparent');
      this.happyChoice.set('position', 'from-right-to-center');
      await this.utils.delayPromise(600); // !!!! hacky
      this.sadChoice.set('opacity', 'transparent');
      this.happyChoice.set('position', 'center');
      return;
    }
  },

  smileyGrouping: null,
  onSmileyClick: null, // closure action

  smileyGroupingId: '3', // !!!!!

  sadSmileyFace: computed(
    function () {
      return EmberObject.create({
        id: '18',
        type: 'sad',
        fill: 'filled',
        opacity: 'opaque',
        position: 'center',
      });
    }
  ),

  happySmileyFace: computed(
    function () {
      return EmberObject.create({
        id: '4',
        type: 'happy',
        fill: 'filled',
        opacity: 'opaque',
        position: 'center',
      });
    }
  ),

  sadChoice: computed(
    function () {
      return EmberObject.create({ // !!!!!
        id: '7',
        type: 'sad',
        fill: 'outline',
        opacity: 'opaque',
        position: 'left',
      });
    }
  ),

  happyChoice: computed(
    function () {
      return EmberObject.create({ // !!!!!
        id: '10',
        type: 'happy',
        fill: 'outline',
        opacity: 'opaque',
        position: 'right',
      });
    }
  ),

  opacity: computed(
    'smileyGrouping.opacity',
    function () {
      return `opacity-${this.smileyGrouping.opacity}`;
    }
  ),

  position: computed(
    'smileyGrouping.position',
    function () {
      return `position-${this.smileyGrouping.position}`;
    }
  ),
});

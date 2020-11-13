import Service from '@ember/service';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { readOnly } from '@ember/object/computed';
import RSVP from 'rsvp';

export default Service.extend({
  registry: service(),
  utils: service(),

  init() {
    this._super(...arguments);
    this.reset();
  },

  initialSadInteger: null,
  initialHappyInteger: null,
  isBisectingDone: null,
  integralMidpoint: null,
  groupings: null,

  reset() {
    this.set('initialSadInteger', null);
    this.set('initialHappyInteger', null);
    this.set('isBisectingDone', false);
    this.set('integralMidpoint', null);
    this.set('groupings', []);
  },

  sadSide: computed(
    'initialSadInteger',
    'initialHappyInteger',
    function () {
      if (this.initialSadInteger > this.initialHappyInteger) return 'right';
      if (this.initialSadInteger < this.initialHappyInteger) return 'left';
      throw 'could not compute sad side';
    }
  ),
  happySide: computed(
    'initialHappyInteger',
    'initialSadInteger',
    function () {
      if (this.initialHappyInteger > this.initialSadInteger) return 'right';
      if (this.initialHappyInteger < this.initialSadInteger) return 'left';
      throw 'could not compute happy side';
    }
  ),

  _areAnimationsActive: false,

  animateSetup() {
    if (this.areAnimationsActive) return;
    this.set('_areAnimationsActive', true);
    return RSVP.resolve().then(() => {
      return this._animateSetup();
    }).finally(() => {
      this.set('_areAnimationsActive', false);
    });
  },

  animateDecision(decision) {
    if (this.areAnimationsActive) return;
    this.set('_areAnimationsActive', true);
    return RSVP.resolve().then(() => {
      return this._animateDecision(decision);
    }).finally(() => {
      this.set('_areAnimationsActive', false);
    });
  },

  async _animateSetup() {
    this._addSadGrouping();
    this._addHappyGrouping();
    await this.utils.domRenderPromise();
    await this.utils.delayPromise(300);
    this._advanceBisecting();
    await this._animateAdvancement();
  },

  async _animateDecision(decision) {
    if (decision === 'left')  await this._animateLeft();
    if (decision === 'right') await this._animateRight();
    this._advanceBisecting();
    await this._animateAdvancement();
  },

  _advanceBisecting() {
    const integerA = this._leftGrouping().integer;
    const integerB = this._rightGrouping().integer;
    const isBisectingDone = this.utils.amDone(integerA, integerB); // !!! this util is gross
    this.set('isBisectingDone', isBisectingDone);
    const integralMidpoint = this.utils.chooseIntegralMidpoint(integerA, integerB);
    this.set('integralMidpoint', integralMidpoint);
  },

  async _animateAdvancement() {
    const centerGrouping = this._addCenterGrouping();
    await this.utils.domRenderPromise();
    if (this.isBisectingDone) {
      await this.registry.componentFor(centerGrouping).fadeFromTransparentToOpaque(); // !!! should this even be a center grouping?
    } else {
      await RSVP.all([
        this.registry.componentFor(centerGrouping).fadeFromTransparentToOpaque(),
        this.registry.componentFor({ type: 'question', id: 'the-only-question' }).fadeFromTransparentToOpaque(),
      ]);
    }
  },

  async _animateLeft() {
    const leftChoice = this._leftChoice();
    const rightChoice = this._rightChoice();
    const leftGrouping = this._leftGrouping();
    const centerGrouping = this._centerGrouping();
    leftChoice.set('fill', 'yellow');
    await RSVP.all([
      this.registry.componentFor({ type: 'question', id: 'the-only-question' }).fadeFromOpaqueToTransparent(),
      this.registry.componentFor(rightChoice).fadeFromOpaqueToTransparent(),
      this.utils.delayPromise(200).then(() => this.registry.componentFor(leftChoice).moveFromLeftToCenter())
    ]);
    await this.utils.domRenderPromise();
    await RSVP.all([
      this.registry.componentFor(leftGrouping).moveFromLeftToFarLeft(),
      this.registry.componentFor(centerGrouping).moveFromCenterToLeft(),
    ]);
    this._removeFace(centerGrouping, rightChoice);
    this._removeGrouping(leftGrouping);
  },

  async _animateRight() {
    const leftChoice = this._leftChoice();
    const rightChoice = this._rightChoice();
    const rightGrouping = this._rightGrouping();
    const centerGrouping = this._centerGrouping();
    rightChoice.set('fill', 'yellow');
    await RSVP.all([
      this.registry.componentFor({ type: 'question', id: 'the-only-question' }).fadeFromOpaqueToTransparent(),
      this.registry.componentFor(leftChoice).fadeFromOpaqueToTransparent(),
      this.utils.delayPromise(200).then(() => this.registry.componentFor(rightChoice).moveFromRightToCenter())
    ]);
    await this.utils.domRenderPromise();
    await RSVP.all([
      this.registry.componentFor(rightGrouping).moveFromRightToFarRight(),
      this.registry.componentFor(centerGrouping).moveFromCenterToRight()
    ]);
    this._removeFace(centerGrouping, leftChoice);
    this._removeGrouping(rightGrouping);
  },

  // ### FINDERS ###

  _leftGrouping() {
    return this.groupings.find(
      grouping => grouping.position === 'left'
    );
  },

  _rightGrouping() {
    return this.groupings.find(
      grouping => grouping.position === 'right'
    );
  },

  _centerGrouping() {
    return this.groupings.find(
      grouping => grouping.position === 'center'
    );
  },

  _leftChoice() {
    return this._centerGrouping().faces.find(
      face => face.position === 'left'
    );
  },

  _rightChoice() {
    return this._centerGrouping().faces.find(
      face => face.position === 'right'
    );
  },

  // ### ADDERS ###

  _addSadGrouping() {
    const grouping = EmberObject.create({
      id: this.utils.generateUuid(),
      type: 'grouping',
      integer: this.initialSadInteger,
      opacity: 'opaque',
      position: this.sadSide,
      faces: [
        EmberObject.create({
          id: this.utils.generateUuid(),
          type: 'face',
          smile: 'sad',
          opacity: 'opaque',
          position: 'center',
          fill: 'yellow'
        })
      ]
    });
    this.groupings.pushObject(grouping);
    return grouping;
  },

  _addHappyGrouping() {
    const grouping = EmberObject.create({
      id: this.utils.generateUuid(),
      type: 'grouping',
      integer: this.initialHappyInteger,
      opacity: 'opaque',
      position: this.happySide,
      faces: [
        EmberObject.create({
          id: this.utils.generateUuid(),
          type: 'face',
          smile: 'happy',
          opacity: 'opaque',
          position: 'center',
          fill: 'yellow'
        })
      ]
    });
    this.groupings.pushObject(grouping);
    return grouping;
  },

  _addCenterGrouping() {
    if (this.isBisectingDone) {
      return this._addDoneCenterGrouping();
    } else {
      return this._addChoiceCenterGrouping();
    }
  },

  _addDoneCenterGrouping() {
    const grouping = EmberObject.create({
      id: this.utils.generateUuid(),
      type: 'grouping',
      opacity: 'transparent',
      position: 'center',
      faces: []
    });
    this.groupings.pushObject(grouping);
    return grouping;
  },

  _addChoiceCenterGrouping() {
    const grouping = EmberObject.create({
      id: this.utils.generateUuid(),
      type: 'grouping',
      integer: this.integralMidpoint,
      opacity: 'transparent',
      position: 'center',
      faces: [
        EmberObject.create({
          id: this.utils.generateUuid(),
          type: 'face',
          smile: 'sad',
          opacity: 'opaque',
          position: this.sadSide,
          fill: 'none'
        }),
        EmberObject.create({
          id: this.utils.generateUuid(),
          type: 'face',
          smile: 'happy',
          opacity: 'opaque',
          position: this.happySide,
          fill: 'none'
        })
      ]
    });
    this.groupings.pushObject(grouping);
    return grouping;
  },

  // ### REMOVERS ###

  _removeFace(grouping, face) {
    this.utils.removeMatching(
      grouping.faces,
      element => element.id === face.id
    );
  },

  _removeGrouping(grouping) {
    this.utils.removeMatching(
      this.groupings,
      element => element.id === grouping.id
    );
  },
});

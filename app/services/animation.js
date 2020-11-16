import Service from '@ember/service';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { task, didCancel } from 'ember-concurrency';
import RSVP from 'rsvp';

export default Service.extend({
  init() {
    this._super(...arguments);
    this.reset();
  },

  initialSadInteger: null,
  initialHappyInteger: null,
  isBisectingDone: null,
  integralMidpoint: null,
  question: null,
  groupings: null,
  done: null,

  reset() {
    this.set('initialSadInteger', null);
    this.set('initialHappyInteger', null);
    this.set('isBisectingDone', false);
    this.set('integralMidpoint', null);
    this.set('question', null);
    this.set('groupings', []);
    this.set('done', null);
  },

  async animateSetup() {
    try {
      await this._animateTask.perform('setup');
    } catch (error) {
      if (! didCancel(error)) throw error;
    }
  },

  async animateDecision(decision) {
    try {
      await this._animateTask.perform('decision', decision);
    } catch (error) {
      if (! didCancel(error)) throw error;
    }
  },

  _animateTask: task(function * (kind, decision) {
    if (kind === 'setup') {
      yield this._animateSetup();
    }
    if (kind === 'decision') {
      yield this._animateDecision(decision);
    }
  }).drop(), // using 'drop' task modifier to cancel unwanted simultaneous animations

  utils: service(),

  async _animateSetup() {
    this._addQuestion();
    this._addSadGrouping();
    this._addHappyGrouping();
    await this.utils.delayPromise(300);
    await this._animateAdvanceBisecting();
  },

  async _animateDecision(decision) {
    if (decision === 'left')  await this._animateDecisionLeft();
    if (decision === 'right') await this._animateDecisionRight();
    await this._animateAdvanceBisecting();
  },

  registry: service(),

  async _animateDecisionLeft() {
    const leftChoice = this._leftChoice();
    const rightChoice = this._rightChoice();
    const leftGrouping = this._leftGrouping();
    const centerGrouping = this._centerGrouping();
    leftChoice.set('fill', 'yellow');
    await RSVP.all([
      this.registry.componentFor(this.question).fadeFromOpaqueToTransparent(),
      this.registry.componentFor(rightChoice).fadeFromOpaqueToTransparent(),
      this.utils.delayPromise(200).then(() => this.registry.componentFor(leftChoice).moveFromLeftToCenter()),
    ]);
    await this.utils.domRenderPromise();
    await RSVP.all([
      this.registry.componentFor(leftGrouping).moveFromLeftToFarLeft(),
      this.registry.componentFor(centerGrouping).moveFromCenterToLeft(),
    ]);
    this._removeFace(centerGrouping, rightChoice);
    this._removeGrouping(leftGrouping);
  },

  async _animateDecisionRight() {
    const leftChoice = this._leftChoice();
    const rightChoice = this._rightChoice();
    const rightGrouping = this._rightGrouping();
    const centerGrouping = this._centerGrouping();
    rightChoice.set('fill', 'yellow');
    await RSVP.all([
      this.registry.componentFor(this.question).fadeFromOpaqueToTransparent(),
      this.registry.componentFor(leftChoice).fadeFromOpaqueToTransparent(),
      this.utils.delayPromise(200).then(() => this.registry.componentFor(rightChoice).moveFromRightToCenter()),
    ]);
    await this.utils.domRenderPromise();
    await RSVP.all([
      this.registry.componentFor(rightGrouping).moveFromRightToFarRight(),
      this.registry.componentFor(centerGrouping).moveFromCenterToRight(),
    ]);
    this._removeFace(centerGrouping, leftChoice);
    this._removeGrouping(rightGrouping);
  },

  async _animateAdvanceBisecting() {
    this._advanceBisecting();
    if (this.isBisectingDone) {
      this._addDone();
      await this.utils.domRenderPromise();
      await this.registry.componentFor(this.done).fadeFromTransparentToOpaque();
    } else {
      const centerGrouping = this._addCenterGrouping();
      await this.utils.domRenderPromise();
      await RSVP.all([
        this.registry.componentFor(centerGrouping).fadeFromTransparentToOpaque(),
        this.registry.componentFor(this.question).fadeFromTransparentToOpaque(),
      ]);
    }
  },

  _advanceBisecting() {
    const integerA = this._leftGrouping().integer;
    const integerB = this._rightGrouping().integer;
    const isBisectingDone = Math.abs(integerA - integerB) <= 1;
    this.set('isBisectingDone', isBisectingDone);
    const integralMidpoint = this.utils.chooseIntegralMidpoint(integerA, integerB);
    this.set('integralMidpoint', integralMidpoint);
    this.question.set('integer', integralMidpoint);
  },

  // ### FINDERS ###

  _rightGrouping() {
    return this.groupings.find(
      grouping => grouping.position === 'right'
    );
  },

  _leftGrouping() {
    return this.groupings.find(
      grouping => grouping.position === 'left'
    );
  },

  _centerGrouping() {
    return this.groupings.find(
      grouping => grouping.position === 'center'
    );
  },

  _rightChoice() {
    return this._centerGrouping().faces.find(
      face => face.position === 'right'
    );
  },

  _leftChoice() {
    return this._centerGrouping().faces.find(
      face => face.position === 'left'
    );
  },

  // ### ADDERS ###

  uuid: service(),

  _addQuestion() {
    const question = EmberObject.create({
      id: this.uuid.generateUuid(),
      type: 'question',
      integer: null,
      opacity: 'transparent'
    });
    this.set('question', question);
    return question;
  },

  _addSadGrouping() {
    const grouping = EmberObject.create({
      id: this.uuid.generateUuid(),
      type: 'grouping',
      integer: this.initialSadInteger,
      opacity: 'opaque',
      position: this.sadSide,
      faces: [
        EmberObject.create({
          id: this.uuid.generateUuid(),
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
      id: this.uuid.generateUuid(),
      type: 'grouping',
      integer: this.initialHappyInteger,
      opacity: 'opaque',
      position: this.happySide,
      faces: [
        EmberObject.create({
          id: this.uuid.generateUuid(),
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
    const grouping = EmberObject.create({
      id: this.uuid.generateUuid(),
      type: 'grouping',
      integer: this.integralMidpoint,
      opacity: 'transparent',
      position: 'center',
      faces: [
        EmberObject.create({
          id: this.uuid.generateUuid(),
          type: 'face',
          smile: 'sad',
          opacity: 'opaque',
          position: this.sadSide,
          fill: 'none'
        }),
        EmberObject.create({
          id: this.uuid.generateUuid(),
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

  _addDone() {
    const done = EmberObject.create({
      id: this.uuid.generateUuid(),
      type: 'done',
      opacity: 'transparent'
    });
    this.set('done', done);
    return done;
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

  // ### SIDES ###

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
});

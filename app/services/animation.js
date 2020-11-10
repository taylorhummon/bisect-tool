import Service from '@ember/service';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Service.extend({
  componentRegistry: service(),
  utils: service(),

  initialSadInteger: null,
  initialHappyInteger: null,

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

  groupings: null,

  init() {
    this._super(...arguments);
    this.set('groupings', []);
  },

  async animateSetup() {
    this._addSadGrouping();
    this._addHappyGrouping();
    await this.utils.domRenderPromise();
    await this.utils.delayPromise(300);
    await this._animateAddCenterGrouping();
  },

  async animateDecision(decision) {
    if (decision === 'left')  await this._animateLeft();
    if (decision === 'right') await this._animateRight();
    await this._animateAddCenterGrouping();
  },

  async _animateAddCenterGrouping() {
    const centerGrouping = this._addCenterGrouping();
    await this.utils.domRenderPromise();
    await this.utils.delayPromise(10);
    await this.componentRegistry.componentFor(centerGrouping).fadeFromTransparentToOpaque();
  },

  async _animateLeft() {
    const leftChoice = this._leftChoice();
    const rightChoice = this._rightChoice();
    const leftGrouping = this._leftGrouping();
    const centerGrouping = this._centerGrouping();
    await this.componentRegistry.componentFor(rightChoice).fadeFromOpaqueToTransparent();
    await this.componentRegistry.componentFor(leftChoice).moveFromLeftToCenter();
    await this.componentRegistry.componentFor(leftGrouping).moveFromLeftToFarLeft();
    await this.componentRegistry.componentFor(centerGrouping).moveFromCenterToLeft();
    this._removeFace(centerGrouping, rightChoice);
    this._removeGrouping(leftGrouping);
  },

  async _animateRight() {
    const leftChoice = this._leftChoice();
    const rightChoice = this._rightChoice();
    const rightGrouping = this._rightGrouping();
    const centerGrouping = this._centerGrouping();
    await this.componentRegistry.componentFor(leftChoice).fadeFromOpaqueToTransparent();
    await this.componentRegistry.componentFor(rightChoice).moveFromRightToCenter();
    await this.componentRegistry.componentFor(rightGrouping).moveFromRightToFarRight();
    await this.componentRegistry.componentFor(centerGrouping).moveFromCenterToRight();
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
          type: 'sad',
          opacity: 'opaque',
          position: 'center',
          fill: 'outline'
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
          type: 'happy',
          opacity: 'opaque',
          position: 'center',
          fill: 'outline'
        })
      ]
    });
    this.groupings.pushObject(grouping);
    return grouping;
  },

  _addCenterGrouping() {
    const integerA = this._leftGrouping().integer;
    const integerB = this._rightGrouping().integer;
    if (this.utils.amDone(integerA, integerB)) {
      return this._addDoneCenterGrouping();
    } else {
      return this._addChoiceCenterGrouping(integerA, integerB);
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

  _addChoiceCenterGrouping(integerA, integerB) {
    const grouping = EmberObject.create({
      id: this.utils.generateUuid(),
      type: 'grouping',
      integer: this.utils.chooseIntegralMidpoint(integerA, integerB),
      opacity: 'transparent',
      position: 'center',
      faces: [
        EmberObject.create({
          id: this.utils.generateUuid(),
          type: 'sad',
          opacity: 'opaque',
          position: this.sadSide,
          fill: 'outline'
        }),
        EmberObject.create({
          id: this.utils.generateUuid(),
          type: 'happy',
          opacity: 'opaque',
          position: this.happySide,
          fill: 'outline'
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

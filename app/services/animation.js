import Service from '@ember/service';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';

export default Service.extend({
  componentRegistry: service(),
  utils: service(),

  initialSadInteger: null, // !!! do I need these?
  initialHappyInteger: null,

  groupings: null,

  init() {
    this._super(...arguments);
    this.set('groupings', []);
  },

  async animateSetup() {
    this._addSadGrouping(this.initialSadInteger);
    this._addHappyGrouping(this.initialHappyInteger);
    await this.utils.domRenderPromise();
    await this.utils.delayPromise(300);
    await this._animateAddCenterGrouping();
  },

  async animateDecision(decision) {
    if (decision === 'sad')   await this._animateSad();
    if (decision === 'happy') await this._animateHappy();
    await this._animateAddCenterGrouping();
  },

  async _animateAddCenterGrouping() {
    const centerGrouping = this._addCenterGrouping();
    await this.utils.domRenderPromise();
    await this.utils.delayPromise(10);
    const component = this.componentRegistry.componentFor(centerGrouping);
    await this.componentRegistry.componentFor(centerGrouping).fadeFromTransparentToOpaque();
  },

  async _animateSad() {
    const sadChoice = this._sadChoice();
    const happyChoice = this._happyChoice();
    const sadGrouping = this._sadGrouping();
    const happyGrouping = this._happyGrouping();
    const centerGrouping = this._centerGrouping();
    await this.componentRegistry.componentFor(happyChoice).fadeFromOpaqueToTransparent();
    await this.componentRegistry.componentFor(sadChoice).moveFromLeftToCenter();
    await this.componentRegistry.componentFor(sadGrouping).fadeFromOpaqueToTransparent();
    await this.componentRegistry.componentFor(centerGrouping).moveFromCenterToLeft();
    this._removeFace(centerGrouping, happyChoice);
    this._removeGrouping(sadGrouping);
  },

  async _animateHappy() {
    const sadChoice = this._sadChoice();
    const happyChoice = this._happyChoice();
    const sadGrouping = this._sadGrouping();
    const happyGrouping = this._happyGrouping();
    const centerGrouping = this._centerGrouping();
    await this.componentRegistry.componentFor(sadChoice).fadeFromOpaqueToTransparent();
    await this.componentRegistry.componentFor(happyChoice).moveFromRightToCenter();
    await this.componentRegistry.componentFor(happyGrouping).fadeFromOpaqueToTransparent();
    await this.componentRegistry.componentFor(centerGrouping).moveFromCenterToRight();
    this._removeFace(centerGrouping, sadChoice);
    this._removeGrouping(happyGrouping);
  },

  // ### FINDERS ###

  _sadGrouping() {
    return this.groupings.find(
      grouping => grouping.position === 'left'
    );
  },

  _happyGrouping() {
    return this.groupings.find(
      grouping => grouping.position === 'right'
    );
  },

  _centerGrouping() {
    return this.groupings.find(
      grouping => grouping.position === 'center'
    );
  },

  _sadChoice() {
    return this._centerGrouping().faces.find(
      face => face.type === 'sad'
    );
  },

  _happyChoice() {
    return this._centerGrouping().faces.find(
      face => face.type === 'happy'
    );
  },

  // ### ADDERS ###

  _addSadGrouping(integer) {
    const grouping = EmberObject.create({
      id: this.utils.generateUuid(),
      type: 'grouping',
      integer,
      opacity: 'opaque',
      position: 'left',
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

  _addHappyGrouping(integer) {
    const grouping = EmberObject.create({
      id: this.utils.generateUuid(),
      type: 'grouping',
      integer,
      opacity: 'opaque',
      position: 'right',
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
    const integerA = this._sadGrouping().integer;
    const integerB = this._happyGrouping().integer;
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
          position: 'left',
          fill: 'outline'
        }),
        EmberObject.create({
          id: this.utils.generateUuid(),
          type: 'happy',
          opacity: 'opaque',
          position: 'right',
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

import Service from '@ember/service';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';

export default Service.extend({
  componentRegistry: service(),
  utils: service(),

  initialSadInteger: null, // !!! do I need these?
  initialHappyInteger: null,

  smileyGroupings: null,

  init() {
    this._super(...arguments);
    this.set('smileyGroupings', []);
  },

  async animateSetup() {
    this._addSadSmileyGrouping(this.initialSadInteger);
    this._addHappySmileyGrouping(this.initialHappyInteger);
    await this.utils.domRenderPromise();
    await this.utils.delayPromise(300);
    await this._animateAddCenterSmileyGrouping();
  },

  async animateDecision(decision) {
    if (decision === 'sad')   await this._animateSad();
    if (decision === 'happy') await this._animateHappy();
    await this._animateAddCenterSmileyGrouping();
  },

  async _animateAddCenterSmileyGrouping() {
    const centerSmileyGrouping = this._addCenterSmileyGrouping();
    await this.utils.domRenderPromise();
    await this.componentRegistry.componentFor(centerSmileyGrouping).fadeFromTransparentToOpaque();
  },

  async _animateSad() {
    const sadSmileyChoice = this._sadSmileyChoice();
    const happySmileyChoice = this._happySmileyChoice();
    const sadSmileyGrouping = this._sadSmileyGrouping();
    const happySmileyGrouping = this._happySmileyGrouping();
    const centerSmileyGrouping = this._centerSmileyGrouping();
    await this.componentRegistry.componentFor(happySmileyChoice).fadeFromOpaqueToTransparent();
    await this.componentRegistry.componentFor(sadSmileyChoice).moveFromLeftToCenter();
    await this.componentRegistry.componentFor(sadSmileyGrouping).fadeFromOpaqueToTransparent();
    await this.componentRegistry.componentFor(centerSmileyGrouping).moveFromCenterToLeft();
    this._removeSmileyFace(centerSmileyGrouping, happySmileyChoice);
    this._removeSmileyGrouping(sadSmileyGrouping);
  },

  async _animateHappy() {
    const sadSmileyChoice = this._sadSmileyChoice();
    const happySmileyChoice = this._happySmileyChoice();
    const sadSmileyGrouping = this._sadSmileyGrouping();
    const happySmileyGrouping = this._happySmileyGrouping();
    const centerSmileyGrouping = this._centerSmileyGrouping();
    await this.componentRegistry.componentFor(sadSmileyChoice).fadeFromOpaqueToTransparent();
    await this.componentRegistry.componentFor(happySmileyChoice).moveFromRightToCenter();
    await this.componentRegistry.componentFor(happySmileyGrouping).fadeFromOpaqueToTransparent();
    await this.componentRegistry.componentFor(centerSmileyGrouping).moveFromCenterToRight();
    this._removeSmileyFace(centerSmileyGrouping, sadSmileyChoice);
    this._removeSmileyGrouping(happySmileyGrouping);
  },

  // ### FINDERS ###

  _sadSmileyGrouping() {
    return this.smileyGroupings.find(
      smileyGrouping => smileyGrouping.position === 'left'
    );
  },

  _happySmileyGrouping() {
    return this.smileyGroupings.find(
      smileyGrouping => smileyGrouping.position === 'right'
    );
  },

  _centerSmileyGrouping() {
    return this.smileyGroupings.find(
      smileyGrouping => smileyGrouping.position === 'center'
    );
  },

  _sadSmileyChoice() {
    return this._centerSmileyGrouping().smileyFaces.find(
      smileyFace => smileyFace.type === 'sad'
    );
  },

  _happySmileyChoice() {
    return this._centerSmileyGrouping().smileyFaces.find(
      smileyFace => smileyFace.type === 'happy'
    );
  },

  // ### ADDERS ###

  _addSadSmileyGrouping(integer) {
    const smileyGrouping = EmberObject.create({
      id: this.utils.generateUuid(),
      type: 'grouping',
      integer,
      opacity: 'opaque',
      position: 'left',
      smileyFaces: [
        EmberObject.create({
          id: this.utils.generateUuid(),
          type: 'sad',
          opacity: 'opaque',
          position: 'center',
          fill: 'outline'
        })
      ]
    });
    this.smileyGroupings.pushObject(smileyGrouping);
    return smileyGrouping;
  },

  _addHappySmileyGrouping(integer) {
    const smileyGrouping = EmberObject.create({
      id: this.utils.generateUuid(),
      type: 'grouping',
      integer,
      opacity: 'opaque',
      position: 'right',
      smileyFaces: [
        EmberObject.create({
          id: this.utils.generateUuid(),
          type: 'happy',
          opacity: 'opaque',
          position: 'center',
          fill: 'outline'
        })
      ]
    });
    this.smileyGroupings.pushObject(smileyGrouping);
    return smileyGrouping;
  },

  _addCenterSmileyGrouping() {
    const integerA = this._sadSmileyGrouping().integer;
    const integerB = this._happySmileyGrouping().integer;
    if (this.utils.amDone(integerA, integerB)) {
      return this._addDoneCenterSmileyGrouping();
    } else {
      return this._addChoiceCenterSmileyGrouping(integerA, integerB);
    }
  },

  _addDoneCenterSmileyGrouping() {
    const smileyGrouping = EmberObject.create({
      id: this.utils.generateUuid(),
      type: 'grouping',
      opacity: 'transparent',
      position: 'center',
      smileyFaces: []
    });
    this.smileyGroupings.pushObject(smileyGrouping);
    return smileyGrouping;
  },

  _addChoiceCenterSmileyGrouping(integerA, integerB) {
    const smileyGrouping = EmberObject.create({
      id: this.utils.generateUuid(),
      type: 'grouping',
      integer: this.utils.chooseIntegralMidpoint(integerA, integerB),
      opacity: 'transparent',
      position: 'center',
      smileyFaces: [
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
    this.smileyGroupings.pushObject(smileyGrouping);
    return smileyGrouping;
  },

  // ### REMOVERS ###

  _removeSmileyFace(smileyGrouping, smileyFace) {
    this.utils.removeMatching(
      smileyGrouping.smileyFaces,
      element => element.id === smileyFace.id
    );
  },

  _removeSmileyGrouping(smileyGrouping) {
    this.utils.removeMatching(
      this.smileyGroupings,
      element => element.id === smileyGrouping.id
    );
  },
});

import Service from '@ember/service';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';

export default Service.extend({
  utils: service(),

  initialSadInteger: null,
  initialHappyInteger: null,

  smileyGroupings: null,
  _smileyGroupingComponents: null,
  _smileyFaceComponents: null,

  init() {
    this._super(...arguments);
    this.set('smileyGroupings', []);
    this.set('_smileyGroupingComponents', new Map());
    this.set('_smileyFaceComponents', new Map());
  },

  async setupAnimatedCanvas() {
    this.smileyGroupings = [
      this._buildSadSmileyGrouping(this.initialSadInteger),
      this._buildHappySmileyGrouping(this.initialHappyInteger),
    ];
    await this.utils.domRenderPromise();
    await this.utils.delayPromise(300);
    await this.animateInit();
  },

  _buildSadSmileyGrouping(integer) {
    return EmberObject.create({
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
  },

  _buildHappySmileyGrouping(integer) {
    return EmberObject.create({
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
  },

  _buildCenterSmileyGrouping(integer) {
    return EmberObject.create({
      id: this.utils.generateUuid(),
      type: 'grouping',
      integer,
      opacity: 'opaque',
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
  },

  _buildTransparentSmileyGrouping(integer) {
    return EmberObject.create({
      id: this.utils.generateUuid(),
      type: 'grouping',
      integer,
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
  },

  _buildTransparentDoneSmileyGrouping() {
    return EmberObject.create({
      id: this.utils.generateUuid(),
      type: 'grouping',
      opacity: 'transparent',
      position: 'center',
      smileyFaces: []
    });
  },

  registerSmileyGroupingComponent(id, component) {
    this._smileyGroupingComponents.set(id, component);
  },

  unregisterSmileyGroupingComponent(id) {
    this._smileyGroupingComponents.delete(id);
  },

  registerSmileyFaceComponent(id, component) {
    this._smileyFaceComponents.set(id, component);
  },

  unregisterSmileyFaceComponent(id) {
    this._smileyFaceComponents.delete(id);
  },

  async animateDecision(decision) {
    if (decision === 'sad')   await this._animateSad();
    if (decision === 'happy') await this._animateHappy();
    await this.animateInit();
  },

  async animateInit() {
    const sadSmileyGrouping = this._sadSmileyGrouping();
    const happySmileyGrouping = this._happySmileyGrouping();
    let centerSmileyGrouping = null;
    if (this.utils.amDone(sadSmileyGrouping.integer, happySmileyGrouping.integer)) {
      centerSmileyGrouping = this._buildTransparentDoneSmileyGrouping();
    } else {
      const integer = this.utils.chooseIntegralMidpoint(sadSmileyGrouping.integer, happySmileyGrouping.integer);
      centerSmileyGrouping = this._buildTransparentSmileyGrouping(integer);
    }
    this.smileyGroupings.pushObject(centerSmileyGrouping);
    await this.utils.domRenderPromise();
    await this._componentFor(centerSmileyGrouping).fadeFromTransparentToOpaque();
  },

  async _animateSad() {
    const sadSmileyChoice = this._sadSmileyChoice();
    const happySmileyChoice = this._happySmileyChoice();
    const sadSmileyGrouping = this._sadSmileyGrouping();
    const happySmileyGrouping = this._happySmileyGrouping();
    const centerSmileyGrouping = this._centerSmileyGrouping();
    await this._componentFor(happySmileyChoice).fadeFromOpaqueToTransparent();
    await this._componentFor(sadSmileyChoice).moveFromLeftToCenter();
    await this._componentFor(sadSmileyGrouping).fadeFromOpaqueToTransparent();
    await this._componentFor(centerSmileyGrouping).moveFromCenterToLeft();
    this._removeSmileyFace(centerSmileyGrouping, happySmileyChoice);
    this._removeSmileyGrouping(sadSmileyGrouping);
  },

  async _animateHappy() {
    const sadSmileyChoice = this._sadSmileyChoice();
    const happySmileyChoice = this._happySmileyChoice();
    const sadSmileyGrouping = this._sadSmileyGrouping();
    const happySmileyGrouping = this._happySmileyGrouping();
    const centerSmileyGrouping = this._centerSmileyGrouping();
    await this._componentFor(sadSmileyChoice).fadeFromOpaqueToTransparent();
    await this._componentFor(happySmileyChoice).moveFromRightToCenter();
    await this._componentFor(happySmileyGrouping).fadeFromOpaqueToTransparent();
    await this._componentFor(centerSmileyGrouping).moveFromCenterToRight();
    this._removeSmileyFace(centerSmileyGrouping, sadSmileyChoice);
    this._removeSmileyGrouping(happySmileyGrouping);
  },

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

  _removeSmileyFace(smileyGrouping, smileyFace) {
    const smileyFaces = smileyGrouping.smileyFaces;
    for (let i = smileyFaces.length - 1; i >= 0; i--) {
      if (smileyFaces.objectAt(i).id === smileyFace.id) {
        smileyFaces.removeAt(i);
      }
    }
  },

  _removeSmileyGrouping(smileyGrouping) {
    const smileyGroupings = this.smileyGroupings;
    for (let i = smileyGroupings.length - 1; i >= 0; i--) {
      if (smileyGroupings.objectAt(i).id === smileyGrouping.id) {
        smileyGroupings.removeAt(i);
      }
    }
  },

  _componentFor(object) {
    if (object.type === 'grouping') {
      return this._smileyGroupingComponents.get(object.id);
    }
    if (['sad', 'happy'].includes(object.type)) {
      return this._smileyFaceComponents.get(object.id);
    }
    return null;
  },
});

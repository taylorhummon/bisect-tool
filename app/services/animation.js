import Service from '@ember/service';
import EmberObject from '@ember/object';
import { inject as service } from '@ember/service';

export default Service.extend({
  utils: service(),

  smileyGroupings: null,
  _smileyGroupingComponents: null,
  _smileyFaceComponents: null,

  init() {
    this._super(...arguments);
    this.set('smileyGroupings', []);
    this.set('_smileyGroupingComponents', new Map());
    this.set('_smileyFaceComponents', new Map());
  },

  setupAnimatedCanvas() {
    // !!!! do I need to be using ember objects?
    this.smileyGroupings = [
      EmberObject.create({
        id: this.utils.generateUuid(),
        type: 'single-sad',
        opacity: 'opaque',
        position: 'left',
        smileyFaces: [
          EmberObject.create({
            id: this.utils.generateUuid(),
            type: 'sad',
            opacity: 'opaque',
            position: 'center',
            fill: 'filled'
          })
        ]
      }),
      EmberObject.create({
        id: this.utils.generateUuid(),
        type: 'single-happy',
        opacity: 'opaque',
        position: 'right',
        smileyFaces: [
          EmberObject.create({
            id: this.utils.generateUuid(),
            type: 'happy',
            opacity: 'opaque',
            position: 'center',
            fill: 'filled'
          })
        ]
      }),
      EmberObject.create({
        id: this.utils.generateUuid(),
        type: 'choice',
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
      }),
    ];
  },

  registerSmileyGroupingComponent(id, component) {
    this._smileyGroupingComponents.set(id, component);
  },

  unregisterSmileyGroupingComponent() {
  },

  registerSmileyFaceComponent(id, component) {
    this._smileyFaceComponents.set(id, component);
  },

  unregisterSmileyFaceComponent() {
  },

  async animate(decision) {
    if (decision === 'sad') {
      await this._animateSad();
    }
    if (decision === 'happy') {
      await this._animateHappy();
    }
  },

  async _animateSad() {
    const sadSmileyGrouping = this._sadSmileyGrouping();
    const happySmileyGrouping = this._happySmileyGrouping();
    const choiceSmileyGrouping = this._choiceSmileyGrouping();
    const sadSmileyChoice = this._sadSmileyChoice()
    const happySmileyChoice = this._happySmileyChoice();

    await this._componentFor(happySmileyChoice).fadeFromOpaqueToTransparent();
    await this._componentFor(sadSmileyChoice).moveFromLeftToCenter();
    await this._componentFor(sadSmileyGrouping).fadeFromOpaqueToTransparent();
    await this._componentFor(choiceSmileyGrouping).moveFromCenterToLeft();
  },

  async _animateHappy() {
    const sadSmileyGrouping = this._sadSmileyGrouping();
    const happySmileyGrouping = this._happySmileyGrouping();
    const choiceSmileyGrouping = this._choiceSmileyGrouping();
    const sadSmileyChoice = this._sadSmileyChoice()
    const happySmileyChoice = this._happySmileyChoice();

    await this._componentFor(sadSmileyChoice).fadeFromOpaqueToTransparent();
    await this._componentFor(happySmileyChoice).moveFromRightToCenter();
    await this._componentFor(happySmileyGrouping).fadeFromOpaqueToTransparent();
    await this._componentFor(choiceSmileyGrouping).moveFromCenterToRight();
  },

  // _removeSmileyGrouping(oldSmileyGrouping) {
  //   for (let i = this.smileyGroupings.length - 1; i >= 0; i--) {
  //     const smileyGrouping = this.smileyGroupings.objectAt(i);
  //     if (smileyGrouping.id === oldSmileyGrouping.id) this.smileyGroupings.removeAt(i);
  //   }
  // },

  _sadSmileyGrouping() {
    return this.smileyGroupings.find(
      smileyGrouping => smileyGrouping.type === 'single-sad'
    );
  },

  _happySmileyGrouping() {
    return this.smileyGroupings.find(
      smileyGrouping => smileyGrouping.type === 'single-happy'
    );
  },

  _choiceSmileyGrouping() {
    return this.smileyGroupings.find(
      smileyGrouping => smileyGrouping.type === 'choice'
    );
  },

  _sadSmileyChoice() {
    return this._choiceSmileyGrouping().smileyFaces.find(
      smileyFace => smileyFace.type === 'sad'
    );
  },

  _happySmileyChoice() {
    return this._choiceSmileyGrouping().smileyFaces.find(
      smileyFace => smileyFace.type === 'happy'
    );
  },

  _componentFor(object) {
    if (['single-sad', 'single-happy', 'choice'].includes(object.type)) {
      return this._smileyGroupingComponents.get(object.id);
    }
    if (['sad', 'happy'].includes(object.type)) {
      return this._smileyFaceComponents.get(object.id);
    }
    return null;
  },
});

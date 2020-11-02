import Service from '@ember/service';
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

  async animate(decision) {
    if (decision === 'sad') {
      await this._animateSad();
    }
    if (decision === 'happy') {
      await this._animateHappy();
    }
  },

  async _animateSad() {
    const sadSmileyGrouping = this.smileyGroupings.find(
      smileyGrouping => smileyGrouping.type === 'sad'
    );
    const sadGroupingComponent = this._smileyGroupingComponents.get(sadSmileyGrouping.id);
    const happySmileyGrouping = this.smileyGroupings.find(
      smileyGrouping => smileyGrouping.type === 'happy'
    );
    const happyGroupingComponent = this._smileyGroupingComponents.get(happySmileyGrouping.id);
    const choiceSmileyGrouping = this.smileyGroupings.find(
      smileyGrouping => smileyGrouping.type === 'choice'
    );
    const choiceGroupingComponent = this._smileyGroupingComponents.get(choiceSmileyGrouping.id);
    const sadSmileyChoice = choiceSmileyGrouping.smileyFaces.find(
      smileyFace => smileyFace.type === 'sad'
    );
    const sadSmileyChoiceComponent = this._smileyFaceComponents.get(sadSmileyChoice.id);
    const happySmileyChoice = choiceSmileyGrouping.smileyFaces.find(
      smileyFace => smileyFace.type === 'happy'
    );
    const happySmileyChoiceComponent = this._smileyFaceComponents.get(happySmileyChoice.id);

    await happySmileyChoiceComponent.fadeFromOpaqueToTransparent();
    await sadSmileyChoiceComponent.moveFromLeftToCenter();
    await sadGroupingComponent.fadeFromOpaqueToTransparent();
    await choiceGroupingComponent.moveFromCenterToLeft();
  },

  async _animateHappy() {
    const sadSmileyGrouping = this.smileyGroupings.find(
      smileyGrouping => smileyGrouping.type === 'sad'
    );
    const sadGroupingComponent = this._smileyGroupingComponents.get(sadSmileyGrouping.id);
    const happySmileyGrouping = this.smileyGroupings.find(
      smileyGrouping => smileyGrouping.type === 'happy'
    );
    const happyGroupingComponent = this._smileyGroupingComponents.get(happySmileyGrouping.id);
    const choiceSmileyGrouping = this.smileyGroupings.find(
      smileyGrouping => smileyGrouping.type === 'choice'
    );
    const choiceGroupingComponent = this._smileyGroupingComponents.get(choiceSmileyGrouping.id);
    const sadSmileyChoice = choiceSmileyGrouping.smileyFaces.find(
      smileyFace => smileyFace.type === 'sad'
    );
    const sadSmileyChoiceComponent = this._smileyFaceComponents.get(sadSmileyChoice.id);
    const happySmileyChoice = choiceSmileyGrouping.smileyFaces.find(
      smileyFace => smileyFace.type === 'happy'
    );
    const happySmileyChoiceComponent = this._smileyFaceComponents.get(happySmileyChoice.id);

    await sadSmileyChoiceComponent.fadeFromOpaqueToTransparent();
    await happySmileyChoiceComponent.moveFromRightToCenter();
    await happyGroupingComponent.fadeFromOpaqueToTransparent();
    await choiceGroupingComponent.moveFromCenterToRight();
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

  // _removeSmileyGrouping(oldSmileyGrouping) {
  //   for (let i = this.smileyGroupings.length - 1; i >= 0; i--) {
  //     const smileyGrouping = this.smileyGroupings.objectAt(i);
  //     if (smileyGrouping.id === oldSmileyGrouping.id) this.smileyGroupings.removeAt(i);
  //   }
  // },
});

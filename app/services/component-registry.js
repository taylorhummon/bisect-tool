import Service from '@ember/service';

export default Service.extend({
  _smileyGroupingComponents: null,
  _smileyFaceComponents: null,

  init() {
    this._super(...arguments);
    this.set('_smileyGroupingComponents', new Map());
    this.set('_smileyFaceComponents', new Map());
  },

  // !!! would it be cleaner to use a single register and a single unregister function?

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

  // !!! this type code is a little gross
  componentFor(object) {
    if (object.type === 'grouping') {
      const found = this._smileyGroupingComponents.get(object.id);
      if (found) return found;
    }
    if (['sad', 'happy'].includes(object.type)) {
      const found = this._smileyFaceComponents.get(object.id);
      if (found) return found;
    }
    throw `could not find component for object ${object}`;
  },
});

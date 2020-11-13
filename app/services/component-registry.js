import Service from '@ember/service';

export default Service.extend({
  _groupingComponents: null,
  _faceComponents: null,
  _questionComponents: null,

  init() {
    this._super(...arguments);
    this.set('_groupingComponents', new Map());
    this.set('_faceComponents', new Map());
    this.set('_questionComponents', new Map());
  },

  registerComponent(type, id, component) {
    if (type === 'grouping')  this._groupingComponents.set(id, component);
    if (type === 'face')      this._faceComponents.set(id, component);
    if (type === 'question')  this._questionComponents.set(id, component);
  },

  unregisterComponent(type, id) {
    if (type === 'grouping')  this._groupingComponents.delete(id);
    if (type === 'face')      this._faceComponents.delete(id);
    if (type === 'question')  this._questionComponents.delete(id);
  },

  componentFor(object) {
    if (object.type === 'grouping') {
      const found = this._groupingComponents.get(object.id);
      if (found) return found;
    }
    if (object.type === 'face') {
      const found = this._faceComponents.get(object.id);
      if (found) return found;
    }
    if (object.type === 'question') {
      const found = this._questionComponents.get(object.id);
      if (found) return found;
    }
    throw `could not find component for object ${object}`;
  },
});

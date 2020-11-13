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
    if (! id) throw 'Missing id';
    if (! component) throw 'Missing component';
    if (type === 'grouping') {
      this._groupingComponents.set(id, component);
    } else if (type === 'face') {
      this._faceComponents.set(id, component);
    } else if (type === 'question') {
      this._questionComponents.set(id, component);
    } else {
      throw `Unknown type: ${type}`;
    }
  },

  unregisterComponent(type, id) {
    if (! id) throw 'Missing id';
    if (type === 'grouping') {
      this._groupingComponents.delete(id);
    } else if (type === 'face') {
      this._faceComponents.delete(id);
    } else if (type === 'question') {
      this._questionComponents.delete(id);
    } else {
      throw `Unknown type: ${type}`;
    }
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
    throw `Could not find component for object ${object}`;
  },
});

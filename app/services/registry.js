import Service from '@ember/service';

export default Service.extend({
  _animatedComponents: null,

  init() {
    this._super(...arguments);
    this.set('_animatedComponents', new Map());
  },

  registerComponent(type, id, component) {
    if (! type) throw 'Missing type';
    if (! id) throw 'Missing id';
    if (! component) throw 'Missing component';
    const key = this._key(type, id);
    this._animatedComponents.set(key, component);
  },

  unregisterComponent(type, id) {
    if (! type) throw 'Missing type';
    if (! id) throw 'Missing id';
    const key = this._key(type, id);
    this._animatedComponents.delete(key);
  },

  componentFor(object) {
    const type = object.type;
    const id = object.id;
    if (! type) throw 'Missing type';
    if (! id) throw 'Missing id';
    const key = this._key(type, id);
    const animatedComponent = this._animatedComponents.get(key);
    if (! animatedComponent) throw `Could not find component for ${type} with id=${id}`;
    return animatedComponent;
  },

  _key(type, id) {
    return `${type}-${id}`;
  },
});

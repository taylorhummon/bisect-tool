import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

const AnimatedComponentMixin = Mixin.create({
  registry: service(),

  didInsertElement() {
    const objectName = this.objectName;
    if (! objectName) 'Animated component must have an objectName attribute';
    const object = this[objectName];
    if (! object) `Animated component must have an ${objectName} attribute`;
    this.registry.registerComponent(objectName, object.id, this);
  },

  willDestroyElement() {
    const objectName = this.objectName;
    const object = this[objectName];
    this.registry.unregisterComponent(objectName, object.id);
  },

  _animate(attributeName, from, to) {
    return new RSVP.Promise((resolve, reject) => {
      const objectName = this.objectName;
      if (! objectName) 'Animated component must have an objectName attribute';
      const object = this[objectName];
      if (! object) {
        reject(`Could not find object ${objectName}`);
        return;
      }
      const attribute = object[attributeName];
      if (attribute !== from) {
        reject(`Attempt to transition ${objectName}'s ${attributeName} from ${from} to ${to}, but found ${attributeName} equal to ${attribute}`);
        return;
      }
      const onAnimationEnd = () => {
        this.element.removeEventListener('animationend', onAnimationEnd);
        object.set(attributeName, to);
        resolve();
      };
      this.element.addEventListener('animationend', onAnimationEnd);
      object.set(attributeName, `from-${from}-to-${to}`);
    });
  },
});

export default AnimatedComponentMixin;

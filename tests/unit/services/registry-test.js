import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';
import EmberObject from '@ember/object';

module('Unit | Service | registry', function (hooks) {
  setupTest(hooks);

  test('storing and retrieving', function (assert) {
    const objectA = EmberObject.create({
      type: 'face',
      id: '123',
      smile: 'happy'
    });
    const objectB = EmberObject.create({
      type: 'face',
      id: '456',
      smile: 'sad'
    });
    const registry = this.owner.lookup('service:registry');
    registry.registerComponent(objectA.type, objectA.id, 'component-a');
    assert.equal(
      registry.componentFor(objectA),
      'component-a',
      'can register a component'
    );
    try {
      registry.componentFor(objectB),
      assert.ok(
        false,
        'looking up a component that has not been registered'
      );
    } catch (error) {
      assert.ok(
        true,
        'looking up a component that has not been registered'
      );
    }
    registry.registerComponent(objectB.type, objectB.id, 'component-b');
    assert.equal(
      registry.componentFor(objectA),
      'component-a',
      'still has component a'
    );
    assert.equal(
      registry.componentFor(objectB),
      'component-b',
      'now has component b too'
    );
    registry.unregisterComponent(objectA.type, objectA.id);
    try {
      registry.componentFor(objectA),
      assert.ok(
        false,
        'does not have component a after unregistering it'
      );
    } catch (error) {
      assert.ok(
        true,
        'does not have component a after unregistering it'
      );
    }
    assert.equal(
      registry.componentFor(objectB),
      'component-b',
      'still has component b',
    );
  });
});

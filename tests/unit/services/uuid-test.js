import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | uuid', function (hooks) {
  setupTest(hooks);

  test('generateUuid()', function (assert) {
    const uuidService = this.owner.lookup('service:uuid');
    const uuidA = uuidService.generateUuid();
    const uuidB = uuidService.generateUuid();
    assert.ok(
      uuidA !== uuidB,
      'generating two uuids gives distinct results'
    );
    assert.ok(
      uuidA.length,
      36,
      'has the correct length'
    );
    console.log('CHAR', uuidA.charAt(9));
    assert.equal(
      uuidA.charAt(8),
      '-',
      'has a dash at index 8'
    );
    assert.equal(
      uuidA.charAt(13),
      '-',
      'has a dash at index 13'
    );
    assert.equal(
      uuidA.charAt(18),
      '-',
      'has a dash at index 18'
    );
    assert.equal(
      uuidA.charAt(23),
      '-',
      'has a dash at index 23'
    );
  });
});

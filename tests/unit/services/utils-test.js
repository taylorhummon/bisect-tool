import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import Service from '@ember/service';

module('Unit | Service | utils', function(hooks) {
  setupTest(hooks);

  test('integerFromString()', function(assert) {
    const utils = this.owner.lookup('service:utils');
    assert.equal(
      utils.integerFromString('12'),
      12,
      'parses a positive number'
    );
    assert.equal(
      utils.integerFromString('-4'),
      -4,
      'parses a negative number'
    );
    assert.equal(
      utils.integerFromString('+3'),
      3,
      'parses a positive number written with a plus sign'
    );
    assert.equal(
      utils.integerFromString('blah'),
      null,
      'refuses to parse garbage'
    );
    assert.equal(
      utils.integerFromString('12blehk'),
      null,
      'refuses to parse garbage even if the garbage has a number in it'
    );
    assert.equal(
      utils.integerFromString('0'),
      0,
      'parses "0"'
    );
    assert.equal(
      utils.integerFromString('-0'),
      0,
      'parses "-0"'
    );
    assert.equal(
      utils.integerFromString('+0'),
      0,
      'parses "+0"'
    );
  });

  test('chooseIntegralMidpoint() when flipCoin() returns true', function(assert) {
    const randomStub = Service.extend({
      flipCoin() {
        return true;
      }
    });
    this.owner.register('service:random', randomStub);
    const utils = this.owner.lookup('service:utils');
    assert.equal(
      utils.chooseIntegralMidpoint(4, 10),
      7,
      'when there is a true midpoint'
    );
    assert.equal(
      utils.chooseIntegralMidpoint(5, 5),
      5,
      'when the endpoints are equal'
    );
    assert.equal(
      utils.chooseIntegralMidpoint(4, 11),
      8,
      'when there are two possible midpoints'
    );
  });

  test('chooseIntegralMidpoint() when flipCoin() returns false', function(assert) {
    const randomStub = Service.extend({
      flipCoin() {
        return false;
      }
    });
    this.owner.register('service:random', randomStub);
    const utils = this.owner.lookup('service:utils');
    assert.equal(
      utils.chooseIntegralMidpoint(4, 11),
      7,
      'when there are two possible midpoints'
    );
  });

  test('isNullOrUndefined()', function(assert) {
    const utils = this.owner.lookup('service:utils');
    assert.equal(
      utils.isNullOrUndefined(null),
      true,
      'for null'
    );
    assert.equal(
      utils.isNullOrUndefined(undefined),
      true,
      'for undefined'
    );
    assert.equal(
      utils.isNullOrUndefined(false),
      false,
      'for false'
    );
    assert.equal(
      utils.isNullOrUndefined(0),
      false,
      'for zero'
    );
  });

  test('generateUuid()', function(assert) {
    const utils = this.owner.lookup('service:utils');
    const uuidA = utils.generateUuid();
    const uuidB = utils.generateUuid();
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

  test('removeMatching()', function(assert) {
    const utils = this.owner.lookup('service:utils');
    const arrayA = ['dog', 'cat', 'mouse'];
    utils.removeMatching(arrayA, () => false);
    assert.deepEqual(
      arrayA,
      ['dog', 'cat', 'mouse'],
      'when we remove nothing'
    );
    const arrayB = ['dog', 'cat', 'mouse'];
    utils.removeMatching(arrayB, x => x === 'cat');
    assert.deepEqual(
      arrayB,
      ['dog', 'mouse'],
      'when we remove an element'
    );
    const arrayC = ['dog', 'cat', 'cat', 'mouse', 'cat'];
    utils.removeMatching(arrayC, x => x === 'cat');
    assert.deepEqual(
      arrayC,
      ['dog', 'mouse'],
      'when we remove multiple elements'
    );
    const arrayD = [];
    utils.removeMatching(arrayD, x => x === 'cat');
    assert.deepEqual(
      arrayD,
      [],
      'removing from an empty array'
    );
  });
});

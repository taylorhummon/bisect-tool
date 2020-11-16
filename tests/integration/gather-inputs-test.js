import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, click, fillIn } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | gather-inputs', function(hooks) {
  setupRenderingTest(hooks);

  test('parses the user inputs when entered correctly', async function(assert) {
    assert.expect(4);
    this.set('begin', (happyInteger, sadInteger) => {
      assert.equal(
        happyInteger,
        18,
        'correctly parses the happy integer'
      );
      assert.equal(
        sadInteger,
        -3,
        'correctly parses the sad integer'
      );
    });
    await render(hbs`<GatherInputs @begin={{this.begin}} />`);
    assert.equal(
      this.element.querySelectorAll('[data-test-error]').length,
      0,
      'starts with zero errors'
    );
    await fillIn('#happy-input', '18');
    await fillIn('#sad-input', '-3');
    await click('[data-test-begin-button]');
    assert.equal(
      this.element.querySelectorAll('[data-test-error]').length,
      0,
      'still has zero errors'
    );
  });

  test('shows errors if we dont enter anything', async function(assert) {
    this.set('begin', () => {});
    await render(hbs`<GatherInputs @begin={{this.begin}} />`);
    assert.equal(
      this.element.querySelectorAll('[data-test-error]').length,
      0,
      'starts with zero errors'
    );
    await click('[data-test-begin-button]');
    assert.equal(
      this.element.querySelectorAll('[data-test-error]').length,
      2,
      'has two errors'
    );
    assert.ok(
      !! this.element.querySelector('[data-test-error-name="missing-happy-number"]'),
      'shows the missing happy number error'
    );
    assert.ok(
      !! this.element.querySelector('[data-test-error-name="missing-sad-number"]'),
      'shows the missing sad number error'
    );
  });

  test('shows an error if we enter an invalid string', async function(assert) {
    this.set('begin', () => {});
    await render(hbs`<GatherInputs @begin={{this.begin}} />`);
    assert.equal(
      this.element.querySelectorAll('[data-test-error]').length,
      0,
      'starts with zero errors'
    );
    await fillIn('#happy-input', '7junktext3');
    await fillIn('#sad-input', '13');
    await click('[data-test-begin-button]');
    assert.equal(
      this.element.querySelectorAll('[data-test-error]').length,
      1,
      'has one error'
    );
    assert.ok(
      !! this.element.querySelector('[data-test-error-name="missing-happy-number"]'),
      'shows the missing happy number error'
    );
  });

  test('shows an error if we enter the same number twice', async function(assert) {
    this.set('begin', () => {});
    await render(hbs`<GatherInputs @begin={{this.begin}} />`);
    assert.equal(
      this.element.querySelectorAll('[data-test-error]').length,
      0,
      'starts with zero errors'
    );
    await fillIn('#happy-input', '-4');
    await fillIn('#sad-input', '-4');
    await click('[data-test-begin-button]');
    assert.equal(
      this.element.querySelectorAll('[data-test-error]').length,
      1,
      'has one error'
    );
    assert.ok(
      !! this.element.querySelector('[data-test-error-name="equal-numbers"]'),
      'shows the equal numbers error'
    );
  });
});

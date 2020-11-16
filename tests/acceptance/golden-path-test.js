import { module, test } from 'qunit';
import { visit } from '@ember/test-helpers';
import { click, fillIn } from '@ember/test-helpers';
import { setupApplicationTest } from 'ember-qunit';
import Service from '@ember/service';

module('Acceptance | golden path', function (hooks) {
  setupApplicationTest(hooks);

  hooks.beforeEach(function () {
    this.delayPromise = this.owner.lookup('service:utils').delayPromise;
    const randomStub = Service.extend({
      flipCoin() {
        return true;
      },
    });
    this.owner.register('service:random', randomStub);
  });

  test('A user taking the golden path', async function (assert) {
    await visit('/');
    assert.equal(
      this.element.querySelector('[data-test-app-title]').innerText,
      'The Bisect Tool',
      'shows the app title'
    );
    assert.ok(
      !! this.element.querySelector('[data-test-app-description]'),
      'shows the app description'
    );
    assert.ok(
      !! this.element.querySelector('.gather-inputs'),
      'asks the user for inputs'
    );
    await fillIn('#happy-input', '12');
    await fillIn('#sad-input', '3');
    await click('[data-test-begin-button]');
    await this.delayPromise(2000);
    assert.equal(
      this.element.querySelector('.animation-canvas .question').innerText,
      'How are things at n = 8?',
      'asks about the midpoint'
    );
    await click('.smiley-face.position-left [data-test-clickable-smiley-face]');
    await this.delayPromise(2000);
    assert.equal(
      this.element.querySelector('.animation-canvas .question').innerText,
      'How are things at n = 10?',
      'asks about the midpoint'
    );
    await click('.smiley-face.position-right [data-test-clickable-smiley-face]');
    await this.delayPromise(2000);
    assert.equal(
      this.element.querySelector('.animation-canvas .question').innerText,
      'How are things at n = 9?',
      'asks about the midpoint'
    );
    await click('.smiley-face.position-left [data-test-clickable-smiley-face]');
    await this.delayPromise(2000);
    assert.equal(
      this.element.querySelector('.animation-canvas .done').innerText,
      'Found it!',
      'declares that the user is done'
    );
    await click('[data-test-start-over-button]');
    assert.ok(
      !! this.element.querySelector('.gather-inputs'),
      'asks the user for inputs'
    );
  });
});

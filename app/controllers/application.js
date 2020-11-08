import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ApplicationController extends Controller {
  @service animation;
  @service utils;

  @tracked inIntro = true;

  @action begin(initialHappyInteger, initialSadInteger) {
    this.animation.set('initialSadInteger', initialSadInteger);
    this.animation.set('initialHappyInteger', initialHappyInteger);
    this.set('inIntro', false);
  }
}

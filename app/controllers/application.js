import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @tracked sad = 0;
  @tracked happy = 10;

  get amDone() {
    return Math.abs(this.sad - this.happy) <= 1;
  }

  get midpoint() {
    return Math.floor((this.sad + this.happy) / 2);
  }

  @action addDataPoint(number, isHappy) {
    if (isHappy) {
      this.happy = number;
    } else {
      this.sad = number;
    }
  }
}

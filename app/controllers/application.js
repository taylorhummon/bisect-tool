import Controller from '@ember/controller';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class ApplicationController extends Controller {
  @tracked sad = 0;
  @tracked happy = 50;
  @tracked midpoint = 25;

  get amDone() {
    return Math.abs(this.sad - this.happy) <= 1;
  }

  @action addDataPoint(number, isHappy) {
    if (isHappy) {
      this.happy = number;
    } else {
      this.sad = number;
    }
    this.chooseMidpoint();
  }

  @action startAnimation() {
    console.log('STARTING ANIMATION');
    const element = document.getElementById("watchme")
    element.addEventListener("animationend", this.listener, false);
    element.className = "slidein";
  }

  listener() {
    const element = document.getElementById("watchme")
    element.className = "stationary";
  }

  chooseMidpoint() {
    let total = this.sad + this.happy;
    if (total % 2 === 1) {
      if (Math.floor(2 * Math.random()) === 0) {
        total += 1;
      } else {
        total -= 1;
      }
    }
    this.midpoint = total / 2;
  }
}

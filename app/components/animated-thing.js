import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  @action moveLeftToRight() {
    console.log('IN ACTION');
    const element = document.getElementById("watchme");
    element.addEventListener("animationend", this.listener, false);
    element.className = "move-left-to-right";
  },

  listener() {
    console.log('DONE MOVING');
    const element = document.getElementById("watchme");
    element.className = "right";
  }
});

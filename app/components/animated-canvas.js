import Component from '@ember/component';
import { action } from '@ember/object';

export default Component.extend({
  @action moveLeftToRight() {
    console.log('IN ACTION');
    const element = document.querySelector(".face-with-number");
    console.log('ELEMENTS', element);
    // const element = elements[0];
    // element.addEventListener("animationend", this.listener, false);
    // console.log('CLASS NAME',  " move-left-to-right");
    element.className = element.className + " move-left-to-right";
  },

  listener() {
    console.log('DONE MOVING');
    //const element = document.querySelector(".face-with-number")[0];
    // element.className = "right";
  }
});

import Component from '@ember/component';
import EmberObject from '@ember/object';
import { action } from '@ember/object';

// !!! consider making this a class
export default Component.extend({
  smilies: null,

  init() {
    console.log('IN INIT');
    this._super(...arguments);
    const initialLeftSmiley = EmberObject.create({
      position: 'state-left',
      opacity: 'state-opaque',
      count: 1
    });
    const initialCenterSmiley = EmberObject.create({
      position: 'state-center',
      opacity: 'state-opaque',
      count: 2
    });
    const initialRightSmiley = EmberObject.create({
      position: 'state-right',
      opacity: 'state-opaque',
      count: 3
    });
    const smilies = [initialLeftSmiley, initialCenterSmiley, initialRightSmiley];
    this.set('smilies', smilies);
  },
});

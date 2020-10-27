import Component from '@ember/component';
import { action } from '@ember/object';

// !!! consider making this a class
export default Component.extend({
  smilies: null,

  init() {
    console.log('IN INIT');
    this._super(...arguments);
    const initialLeftSmiley = { position: 'state-left', opacity: 'state-opaque' };
    const initialCenterSmiley = { position: 'state-center', opacity: 'state-opaque' };
    const initialRightSmiley = { position: 'state-right', opacity: 'state-opaque' };
    const smilies = [initialLeftSmiley, initialCenterSmiley, initialRightSmiley];
    this.set('smilies', smilies);
  },
});

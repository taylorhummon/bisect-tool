import Component from '@ember/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  utils: service(),

  begin: null,

  happyValueString: null,
  sadValueString: null,

  showError: false,

  @action beginClicked() {
    let hasError = false;
    const happyValueInteger = this.utils.integerFromString(this.happyValueString);
    const sadValueInteger = this.utils.integerFromString(this.sadValueString);
    if (happyValueInteger === null) hasError = true;
    if (sadValueInteger === null) hasError = true;
    if (happyValueInteger === sadValueInteger) hasError = true;
    this.set('showError', hasError);
    if (! hasError) this.begin(happyValueInteger, sadValueInteger);
  },
});

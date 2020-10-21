import Application from 'bisect-tool/app';
import config from 'bisect-tool/config/environment';
import { setApplication } from '@ember/test-helpers';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

start();

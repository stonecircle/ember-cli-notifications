/* eslint-disable ember/no-classic-components, ember/no-classic-classes, ember/require-tagless-components, prettier/prettier, ember/no-get */
import Component from '@ember/component';
import { computed } from '@ember/object';
import { htmlSafe } from '@ember/template';
import { inject as service } from '@ember/service';

import layout from '../templates/components/notification-container';

export default Component.extend({
  layout,
  position: 'top',
  notifications: service(),

  classNameBindings: ['computedPosition', ':ember-cli-notifications-notification__container'],
  attributeBindings: ['computedStyle:style', 'position:data-test-notification-container', 'ariaLive:aria-live', 'role'],

  zindex: '1060',
  role: 'status',
  ariaLive: 'polite',

  computedPosition: computed('position', function() {
    return `ember-cli-notifications-notification__container--${this.get('position')}`;
  }),

  computedStyle: computed('zindex', function() {
    return htmlSafe(`z-index: ${this.get('zindex')};`);
  })
});

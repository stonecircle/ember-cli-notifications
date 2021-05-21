/* eslint-disable prettier/prettier */
import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, find } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

module('Integration | Component | notification container', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    let notificationMessages = this.owner.lookup('service:notifications');

    // fix strange setup bug
    notificationMessages.clearAll();

    await render(hbs`<NotificationContainer />`);

    assert.equal(find('*').textContent.trim(), '');
  });
});

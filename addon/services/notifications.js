/* eslint-disable ember/no-classic-classes, prettier/prettier, ember/no-get */
import Service from '@ember/service';
import { A } from '@ember/array';
import { assign } from '@ember/polyfills';
import { cancel, later } from '@ember/runloop';
import EmberObject from '@ember/object';
import { getOwner } from '@ember/application';

export default class NotificationsService extends Service {
  globalsOptions = getOwner(this).resolveRegistration('config:environment')['ember-cli-notifications'] || {};
  autoClear = this.globalsOptions.autoClear || false;
  clearDuration = this.globalsOptions.clearDuration || 3200;
  content = A();

  // Method for adding a notification
  addNotification(options) {
    // If no message is set, throw an error
    if (!options.message) {
      throw new Error("No notification message set");
    }

    const notification = EmberObject.create({
      message: options.message,
      type: options.type || 'info',
      autoClear: options.autoClear ?? this.autoClear ?? false,
      clearDuration: options.clearDuration ?? this.clearDuration ?? 3200,
      onClick: options.onClick,
      htmlContent: options.htmlContent || false,
      cssClasses: options.cssClasses
    });

    this.content.pushObject(notification);

    if (notification.autoClear) {
      notification.set('remaining', notification.get('clearDuration'));

      this.setupAutoClear(notification);
    }

    return notification;
  }

  // Helper methods for each type of notification
  error(message, options) {
    return this.addNotification(assign({
      message: message,
      type: 'error'
    }, options));
  }

  success(message, options) {
    return this.addNotification(assign({
      message: message,
      type: 'success'
    }, options));
  }

  info(message, options) {
    return this.addNotification(assign({
      message: message,
      type: 'info'
    }, options));
  }

  warning(message, options) {
    return this.addNotification(assign({
      message: message,
      type: 'warning'
    }, options));
  }

  removeNotification(notification) {
    if (!notification) {
      return;
    }

    notification.set('dismiss', true);

    // Delay removal from DOM for dismissal animation
    later(this, () => {
      this.content.removeObject(notification);
    }, 500);
  }

  setupAutoClear(notification) {
    notification.set('startTime', Date.now());

    const timer = later(this, () => {
      // Hasn't been closed manually
      if (this.content.indexOf(notification) >= 0) {
          this.removeNotification(notification);
      }
    }, notification.get('remaining'));

    notification.set('timer', timer);
  }

  pauseAutoClear(notification) {
    cancel(notification.get('timer'));

    const elapsed = Date.now() - notification.get('startTime');
    const remaining = notification.get('clearDuration') - elapsed;

    notification.set('remaining', remaining);
  }

  clearAll() {
    this.content.forEach(notification => {
      this.removeNotification(notification);
    });

    return this;
  }
}

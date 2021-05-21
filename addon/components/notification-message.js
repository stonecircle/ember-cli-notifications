/* eslint-disable ember/no-computed-properties-in-native-classes, ember/no-classic-components, ember/no-classic-classes, ember/require-tagless-components, prettier/prettier, ember/no-get */
import Component from '@ember/component';
import { htmlSafe } from '@ember/template';
import { computed, set } from '@ember/object';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

const availableTypes = ['info', 'success', 'warning', 'error'];

export default class NotificationMessage extends Component {
  tagName = '';

  @service notifications;

  paused = false;

  @computed('notification.{htmlContent,message}')
  get message() {
    const { htmlContent, message } = this.notification;
    return htmlContent ? htmlSafe(message) : message;
  }

  @computed('notification.dismiss')
  get dismissClass() {
    return !this.notification.dismiss ? 'ecn_notification-in' : '';
  }

  @computed('notification.onClick')
  get clickableClass() {
    return this.notification.onClick ? 'ecn_notification-clickable' : '';
  }

  @computed('notification.type')
  get validType() {
    let type = this.notification.type;

    if (!type || availableTypes.indexOf(type) === -1) {
      return '';
    }

    return type;
  }

  @computed('validType')
  get processedType() {
    return `ecn_notification-${this.validType || 'unknown'}`;
  }

  @computed('validType')
  get isInfo() {
    return this.validType === 'info';
  }

  @computed('validType')
  get isSuccess() {
    return this.validType === 'success';
  }

  @computed('validType')
  get isWarning() {
    return this.validType === 'warning';
  }

  @computed('validType')
  get isError() {
    return this.validType === 'error';
  }

  // Apply the clear animation duration rule inline
  @computed('paused', 'notification.clearDuration')
  get notificationClearDuration() {
    let duration = Number(`${this.notification.clearDuration}`.replace(/\D/g, ''));
    let playState = this.paused ? 'paused' : 'running';
    let styles = [
      `-webkit-animation-duration: ${duration}ms`,
      `animation-duration: ${duration}ms`,
      `-webkit-animation-play-state: ${playState}`,
      `animation-play-state: ${playState}`,
    ].join(';');

    return htmlSafe(styles);
  }

  @action
  handleOnClick() {
    this.notification.onClick?.(this.notification);
  }

  @action
  removeNotification() {
    this.notifications.removeNotification(this.notification);
  }

  @action
  handleMouseEnter() {
    if (this.notification.autoClear) {
      set(this, 'paused', true);
      this.notifications.pauseAutoClear(this.notification);
    }
  }

  @action
  handleMouseLeave() {
    if (this.notification.autoClear) {
      set(this, 'paused', false);
      this.notifications.setupAutoClear(this.notification);
    }
  }
}

/* eslint-disable ember/no-computed-properties-in-native-classes, ember/no-classic-components, ember/no-classic-classes, ember/require-tagless-components, prettier/prettier, ember/no-get */
import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default class NotificationContainerComponent extends Component {
  position = 'top';
  @service notifications;

  @computed('position')
  get positionClass() {
    return `ecn_container-${this.position}`;
  }
}

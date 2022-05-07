import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class ButtonComponent extends Component {
  @tracked _state = 'default';

  get style() {
    return this.args.style ?? 'default';
  }

  get size() {
    return this.args.size ?? 'default';
  }

  get isActive() {
    return (
      this.args.group &&
      this.args.value &&
      this.args.group.args.value === this.args.value
    );
  }

  get disabled() {
    if (this.args.disabled !== undefined) {
      return this.args.disabled;
    }

    return this.isPending;
  }

  get type() {
    return this.args.type ?? 'button';
  }

  get state() {
    return this.args.state ?? this._state;
  }
  set state(state) {
    this._state = state;
  }

  get isPending() {
    return this.state === 'pending';
  }

  get isFulfilled() {
    return this.state === 'fulfilled';
  }

  get isRejected() {
    return this.state === 'rejected';
  }

  get isSettled() {
    return this.isFulfilled || this.isRejected;
  }

  get text() {
    return this.args[`${this.state}Text`] ?? this.args.text;
  }

  @action
  async handleClick() {
    if (typeof this.args.onClick !== 'function') {
      return;
    }

    try {
      const maybePromise = this.args.onClick(this.args.value);

      if (typeof maybePromise?.then === 'function') {
        this.state = 'pending';

        await maybePromise;

        if (!this.isDestroyed) {
          this.state = 'fulfilled';
        }
      }
    } catch (error) {
      if (!this.isDestroyed) {
        this.state = 'rejected';
      }

      throw error;
    }
  }
}

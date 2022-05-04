import query from '../utils/query';
import { TrackedArray } from 'tracked-built-ins';
import { trackedFunction } from 'ember-resources/util/function';

export default class Index {
  stats = trackedFunction(this, () => query(`${this.indexPath}/stats`));
  displayedAttributes = trackedFunction(this, () =>
    query(`${this.indexPath}/settings/displayed-attributes`)
  );

  constructor(data) {
    for (const key in data) {
      this[key] = data[key];
    }
  }

  get indexPath() {
    return `indexes/${this.uid}`;
  }

  get allAttributesAreDisplayed() {
    return (
      this.displayedAttributes.value &&
      this.displayedAttributes.value.length === 1 &&
      this.displayedAttributes.value[0] === '*'
    );
  }

  getSortableAttributes() {
    return query(`${this.indexPath}/settings/sortable-attributes`).then(
      (result) => new TrackedArray(result)
    );
  }

  getStats() {
    return query(`${this.indexPath}/stats`);
  }

  getSettings() {
    return query(`${this.indexPath}/settings`);
  }

  search(q, options = {}) {
    options.q = q;

    return query(`${this.indexPath}/search`, {
      method: 'POST',
      body: JSON.stringify(options),
    });
  }

  get fields() {
    return this.stats.value
      ? Object.keys(this.stats.value.fieldDistribution)
      : [];
  }
}

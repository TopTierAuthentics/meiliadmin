import EmberRouter from '@ember/routing/router';
import config from 'meiliadmin/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('admin', function () {
    this.route('indexes', function () {
      this.route('item', { path: '/:index_uid' }, function () {
        this.route('settings');
        this.route('info');
        this.route('edit');
        this.route('documents', function () {
          this.route('document', { path: '/:document_id' });
          this.route('new');
        });
      });
      this.route('new');
    });
    this.route('keys', function () {
      this.route('key', { path: '/:uid' });
    });
    this.route('tasks', function () {});
  });
  this.route('login');
});

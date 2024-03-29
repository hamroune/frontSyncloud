(function () {

    'use strict';
    angular
        .module('app.core', [
            'LocalStorageModule',
            'ngMaterial',
            'ngMessages',
            'ngTouch',

            'ui.router',
            'app.utils',

            'app.header',
            'app.sidebar',
            'app.navbar',

            'app.login',
            'app.dashboard',
            'app.toolbar'
        ]);
})();

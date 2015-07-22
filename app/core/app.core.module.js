(function () {

    'use strict';

    angular
        .module('app.core', [
            'ngMaterial',

            'ui.router',
            'app.utils',

            'app.header',
            'app.sidebar',
            'app.navbar',

            'app.dashboard'
        ]);
})();

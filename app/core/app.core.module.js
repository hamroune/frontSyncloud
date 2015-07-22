(function () {

    'use strict';

    angular
        .module('app.core', [
            'ngMaterial',
            'ngTouch',

            'ui.router',
            'app.utils',

            'app.header',
            'app.sidebar',
            'app.navbar',

            'app.dashboard'
        ]);
})();

(function () {

    'use strict';

    angular
        .module('app.core')
        .config(config);

    config.$inject = ['$stateProvider', '$urlRouterProvider'];

    function config($stateProvider, $urlRouterProvider) {

        $stateProvider
          .state('home', {
                url: "/home",
                templateUrl: "dashboard/dashboard.html",
                controller: 'DashboardCtrl'
            }
          );


        $urlRouterProvider.otherwise("/home");
    }

})();

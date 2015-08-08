(function () {
    'use strict';

    function DashboardCtrl($q,$state, $rootScope, $scope, $log,$location, MenuService, ApplicationService) {

        console.log()
      

        ApplicationService.getCurrentUser().then(function(aUser){
          console.log('aUser', aUser);

            $scope.applications = aUser.apps;
        });

        

        $scope.onSelectApp = function(app){
          console.log('Selected App (for detail)', app);
        }

        $scope.onStartApp = function(app){
          console.log('Launch App', app);
        }

        $scope.onRightSwipe = function(){
          console.log('onRightSwipe');
        }

    }

    DashboardCtrl.$inject = ["$q","$state","$rootScope","$scope", "$log","$location", "menuService", "ApplicationService"];

    angular
        .module('app.dashboard')
        .controller('DashboardCtrl', DashboardCtrl);

})();

(function () {
    'use strict';

    function DashboardCtrl($timeout,$q,$state, $rootScope, $scope, $log,$location, MenuService, ApplicationService, localStorageService) {

        var user = localStorageService.get("user");
        $rootScope.user = $rootScope.user || user; 

        if(!$rootScope.user){
            $state.go('login');
            return;
        }
      

       $rootScope.$on('users_replicat', function(change){
            console.log('changes', change);
            $scope.getApps();
        });

        $scope.getApps = function(){
            ApplicationService.getCurrentUser().then(function(aUser){
                $scope.applications = aUser.apps;
                console.log('Apps ==>', aUser.apps);
                $timeout(function(){
                    $scope.$apply();
                })

            });
        }

        $scope.onSelectApp = function(app){
          console.log('Selected App (for detail)', app);
        }

        $scope.onStartApp = function(app){
          console.log('Launch App', app);
        }

        $scope.onRightSwipe = function(){
          console.log('onRightSwipe');
        }

        $scope.getApps();

    }

    DashboardCtrl.$inject = ["$timeout","$q","$state","$rootScope","$scope", "$log","$location", "menuService", "ApplicationService", "localStorageService"];

    angular
        .module('app.dashboard')
        .controller('DashboardCtrl', DashboardCtrl);

})();

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
                
                
                var promises = [];
                _.each(aUser.apps, function(app){
                    promises.push(ApplicationService.getApplication(app));
                })
                $q.all(promises).then(function(applications){
                    console.log('applications', applications);
                    $scope.applications = applications;

                    //$scope.downloadApps();
                });

                $timeout(function(){
                    $scope.$apply();
                })

            }, function(){
                alert('Error getting current user')
            });
        }

        $scope.downloadApps = function(){
            _.each($scope.applications, function(app){
                $scope.downloadApp(app);
            })
        }

        $scope.downloadApp = function(app){
              return ApplicationService.downloadZip(app).then(function(){
                    app.msg = "Complete Zip download"
                });
        }

        $scope.onOpenApp = function(app){
          console.log('Launch App', app);
          $scope.downloadApp(app).then(function(){
            alert('Go !!!')
            ApplicationService.openApp(app);
          });
        }

        $scope.getApps();

    }

    DashboardCtrl.$inject = ["$timeout","$q","$state","$rootScope","$scope", "$log","$location", "menuService", "ApplicationService", "localStorageService"];

    angular
        .module('app.dashboard')
        .controller('DashboardCtrl', DashboardCtrl);

})();

(function () {
    'use strict';

    function DashboardCtrl($timeout,$q,$state, $rootScope, $scope, $log,$location, MenuService, ApplicationService, localStorageService) {

        var user = localStorageService.get("user");
        $rootScope.user = $rootScope.user || user; 

        if(!$rootScope.user){
            $state.go('login');
            return;
        }
      

        $scope.showLoader = true;

        $rootScope.$on('users_replicat', function(change){
            console.log('changes', change);
            $timeout(function(){
              $scope.getApps();
            }, 1000)
        });

        $scope.getApps = function(){
            return ApplicationService.getCurrentUser().then(function(aUser){
                
                var promises = [];
                _.each(aUser.apps, function(app){
                    promises.push(ApplicationService.getApplication(app));
                })
                $q.all(promises).then(function(applications){
                    $scope.applications = applications;
                    $scope.downloadApps().then(function(){

                        console.log('applications', $scope.applications[$scope.applications.length-2]);

                       $timeout(function(){
                        $scope.showLoader = false;
                        $scope.$apply();
                      })
                    });
                });

            }, function(){
                alert('Error getting current user')
            });
        }

        $scope.downloadApps = function(){
          var defered  = $q.defer();

           _.each($scope.applications, function(app){
              app.showProgress = true;
              $timeout(function(){
                $scope.$apply();
              })
           });

            $timeout(function(){
                 var promises = [];
                  _.each($scope.applications, function(app){
                    promises.push($scope.downloadApp(app));
                 });

                $q.all(promises).then(function(){
                    defered.resolve();
                });

              }, 1000)

          return defered.promise;
        }


        //Download if no zip, and Icon
        $scope.downloadApp = function(app){
              app.showProgress = true;
              var defered  = $q.defer();

              ApplicationService.isAppDownloaded(app).then(function(isAppDownloaded){
                if(!isAppDownloaded){
                  var promises = [];
                  promises.push(ApplicationService.downloadZip(app));
                  promises.push(ApplicationService.downloadIcon(app));
                  $q.all(promises).then(function(applications){
                    app.showProgress = false;
                    console.log('After Download  app ', app);
                    defered.resolve(app);
                }, function(){
                  app.showProgress = false;
                });
                 
                }else{
                  app.icon = ApplicationService.getIcon(app);
                  app.showProgress = false;
                  defered.resolve();
                }
              })
              
             return defered.promise;
        }

        $scope.onOpenApp = function(app){
          $scope.downloadApp(app).then(function(){
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

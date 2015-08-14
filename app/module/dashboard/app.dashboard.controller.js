(function () {
    'use strict';

    function DashboardCtrl($timeout,$q,$state, $rootScope, $scope, $log,$location, MenuService, ApplicationService, localStorageService) {

        
        $rootScope.$on('users_replicat', function(change){
            //Pas de changement
            $scope.isForceDownload = false;

            $timeout(function(){
              $scope.getApps();
            }, 1000)
        });


        $rootScope.$on('applications', function(change){
            //On reload si changement des apps
            $scope.isForceDownload = true;

            $timeout(function(){
              $scope.getApps();
            }, 1000);
        });



        var user = localStorageService.get("user");
       
        
        if(!!!user || !!!user.username){
            $state.go('login');
            return;
        }

        $rootScope.user = user;


        ApplicationService.sync('users_replicat');

        var currentUserName = "org.couchdb.user:"+$rootScope.user.username;
              
        ApplicationService.sync('applications', {
            filter: 'user_filters/by_user',
            params: { "user": currentUserName }
        });


        $scope.showLoader = true;

        $scope.getApps = function(){
            return ApplicationService.getCurrentUser().then(function(aUser){
                
                var promises = [];
                _.each(aUser.apps, function(app){
                    promises.push(ApplicationService.getApplication(app));
                })
                $q.all(promises).then(function(applications){
                   
                    $scope.applications = applications;
                    $scope.downloadApps().then(function(){

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

                console.log('$scope.isForceDownload', $scope.isForceDownload);

                if(!isAppDownloaded || $scope.isForceDownload){
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


        $scope.isForceDownload = false;

        $scope.getApps();

    }

    DashboardCtrl.$inject = ["$timeout","$q","$state","$rootScope","$scope", "$log","$location", "menuService", "ApplicationService", "localStorageService"];

    angular
        .module('app.dashboard')
        .controller('DashboardCtrl', DashboardCtrl);

})();

(function () {
    'use strict';

    function DashboardCtrl($timeout,$q,$state, $rootScope, $scope, $log,$location, MenuService, ApplicationService, localStorageService) {

        $rootScope.error = "";
        $rootScope.$$listeners['users_replicat']=[];
        $rootScope.$on('users_replicat', function(ev, change){
            console.log('users_replicat $ON', change);

            ApplicationService.getCurrentUser().then(function(user){
                //Pas de changement
                $scope.isForceDownload = false;

                $timeout(function(){
                  $scope.getApps();
                }, 1000)
            });
        });



        $rootScope.$on('change_users_replicat', function(ev, change){
            console.log('change_users_replicat $ON', change);

            ApplicationService.getCurrentUser().then(function(user){
                //Pas de changement
                $scope.isForceDownload = false;

                $timeout(function(){
                  $scope.getApps();
                }, 1000)
            });
        });

        $rootScope.$$listeners['change_applications']=[];
        $rootScope.$on('change_applications', function(ev, change){
            //On reload si changement des apps
            //$scope.isForceDownload = true;
            $scope.changeApplicationsIds = _.map(change.docs, function(doc){ return doc._id;});
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

        ApplicationService.sync('applications', {
            filter: 'user_apps_filters/by_user_apps',
            params: { "userApps": $rootScope.user.apps }
        });

        var currentUserName = "org.couchdb.user:"+$rootScope.user.username;

        ApplicationService.sync('users_replicat', {
            filter: 'user_filters/by_user',
            params: { "user": currentUserName }
        });


        $scope.showLoader = true;

        $scope.getApps = function(){
            console.log('getApps called')
            return ApplicationService.getCurrentUser().then(function(aUser){
                console.log('voici le user recu ', aUser);

                var promises = [];
                _.each(aUser.apps, function(app){
                    promises.push(ApplicationService.getApplication(app));
                })
                $q.all(promises).then(function(applications){
                    $scope.applications = _.filter(applications, function(appli){return !!appli});

                    console.log('on recupère les applications', applications);
                    $scope.downloadApps().then(function(){


                       $scope.changeApplicationsIds = [];

                       $timeout(function(){
                            $scope.showLoader = false;
                            $scope.$apply();
                      })
                    });
                });

            }, function(){
                $scope.changeApplicationsIds = [];
                $rootScope.error = "Ooops! Error getting current user";
            });
        }

        $scope.downloadApps = function(){
            console.log('on appele le downloadApps');
          var defered  = $q.defer();

           _.each($scope.applications, function(app){
            if(app){
              app.showProgress = true;
              $timeout(function(){
                $scope.$apply();
              })
            }

           });

            $timeout(function(){
                 var promises = [];
                  _.each($scope.applications, function(app){
                    promises.push($scope.downloadApp(app));
                 });

                $q.all(promises).then(function(){
                    console.log('l app est dowloadée OK')
                    defered.resolve();
                });

              }, 1000)

          return defered.promise;
        }


        //Download if no zip, and Icon
        $scope.downloadApp = function(app){
              var defered  = $q.defer();

              if(!app){
                defered.reject();
                return;
              }

              app.showProgress = true;

              ApplicationService.isAppDownloaded(app).then(function(isAppDownloaded){
                console.log('$scope.changeApplicationsIds', $scope.changeApplicationsIds);

                if(!isAppDownloaded  || app.isForceDownload || ($scope.changeApplicationsIds && $scope.changeApplicationsIds.length>0 && $scope.changeApplicationsIds.indexOf(app._id)>=0) ){
                      var promises = [];
                      promises.push(ApplicationService.downloadZip(app));
                      promises.push(ApplicationService.downloadIcon(app));
                      $q.all(promises).then(function(applications){
                            app.showProgress = false;
                            defered.resolve(app);
                       }, function(){
                            app.showProgress = false;
                            defered.resolve(app);
                       });

                }else{
                  app.icon = ApplicationService.getIcon(app);
                  app.showProgress = false;
                  defered.resolve(app);
                }
              }, function(){
                app.showProgress = false;
                defered.resolve(app);
              })

             return defered.promise;
        }

        $scope.onOpenApp = function(app){
          $scope.downloadApp(app).then(function(){
            ApplicationService.openApp(app)
          });
        }


        //START
        $scope.changeApplicationsIds = [];
        $scope.getApps();

    }

    DashboardCtrl.$inject = ["$timeout","$q","$state","$rootScope","$scope", "$log","$location", "menuService", "ApplicationService", "localStorageService"];

    angular
        .module('app.dashboard')
        .controller('DashboardCtrl', DashboardCtrl);

})();

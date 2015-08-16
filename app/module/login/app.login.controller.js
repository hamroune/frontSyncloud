(function () {
    'use strict';

    function LoginCtrl($q,$state, $rootScope, $scope, $log, $location, localStorageService, ApplicationService) {
        var that = this;

        
        $rootScope.login=function(){

            $rootScope.synced = {};

            $rootScope.BASE_URL_AUTH = 'http://195.154.223.114:5984/test'
         
            var db = new PouchDB($rootScope.BASE_URL_AUTH);
      
            db.login($rootScope.user.username, $rootScope.user.password , function (err,response) {
              if (err) {
                if (err.name === 'unauthorized') {
                  $scope.error="Userame or Password incorrect";                
                }else {
                  $scope.error=err;
                }
              }
              else{

                    
               var currentUserName = "org.couchdb.user:"+$rootScope.user.username;

               ApplicationService.getCurrentUser().then(function(user){
                        ApplicationService.sync('users_replicat', {
                           filter: 'user_filters/by_user',
                           params: { "user": currentUserName }
                        });

                        if(user.apps){
                            ApplicationService.sync('applications', {
                                filter: 'user_apps_filters/by_user_apps',
                                params: { "userApps": user.apps }
                            });    
                        }

                    $state.go("home");

               }, function(){
                        console.log('il n existe pas de user en local, c est un nouveau')
                        ApplicationService.sync('users_replicat', {
                           filter: 'user_filters/by_user',
                           params: { "user": currentUserName }
                        }, function(){
                            window.setTimeout(function(){
                                $state.go("home");
                            }, 1000);
                        });
                        
               });
                
              }
          });

        }


        var user = localStorageService.get("user");
        
        if(user && user.username){
            $state.go('home');
        }

        $rootScope.user = {};
        console.log('$rootScope.user starting ', $rootScope.user, 'user from localStorageService', user);

    }

    LoginCtrl.$inject = ["$q","$state","$rootScope","$scope", "$log","$location", "localStorageService", "ApplicationService"];

    angular
        .module('app.login')
        .controller('LoginCtrl', LoginCtrl);

})();

(function () {
    'use strict';

    function LoginCtrl($q,$state, $rootScope, $scope, $log, $location, localStorageService, ApplicationService) {
        var that = this;

        $rootScope.lougout = function(){
          localStorageService.set("user", null);
          $state.go('login');
        }

        
        $rootScope.login=function(){

            console.log('2 --> $rootScope.user starting ', JSON.stringify($rootScope.user), 'user from localStorageService', user);
          
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
              
                localStorageService.set("user", $rootScope.user);
 
                ApplicationService.sync('users_replicat');

                ApplicationService.sync('applications');

                
                $state.go("home");

                
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

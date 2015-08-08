(function () {
    'use strict';

    function LoginCtrl($q,$state, $rootScope, $scope, $log, $location) {
        var that = this;

        $rootScope.user ={};

        $rootScope.login=function(){

          console.log('$rootScope.username', $rootScope.user.username)

            $rootScope.BASE_URL_AUTH = 'http://195.154.223.114:5984/'
               
           
            var db = new PouchDB($rootScope.BASE_URL_AUTH+"_users");

            db.login($rootScope.user.username, $scope.user.password , function (err,response) {

                 console.log('response ===>', response, 'err', err);

               $rootScope.BASE_URL = 'http://'+$rootScope.user.username+':'+$scope.user.password+'@195.154.223.114:5984/'
                window.SyncloudUrl = $rootScope.BASE_URL;


              if (err) {
                if (err.name === 'unauthorized') {
                  $scope.error="Userame or Password incorrect";                }
                else {
                  $scope.error=err;
                }
              }
              else{
                $location.path("/home");
              }
          });

        }
    }

    LoginCtrl.$inject = ["$q","$state","$rootScope","$scope", "$log","$location"];

    angular
        .module('app.login')
        .controller('LoginCtrl', LoginCtrl);

})();

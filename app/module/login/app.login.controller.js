(function () {
    'use strict';

    function LoginCtrl($q,$state, $rootScope, $scope, $log, $location) {
        var that = this;

        $rootScope.user ={};

        $rootScope.sync = function(dbname){
          var localDB = new PouchDB(dbname);
          var url = $rootScope.BASE_URL+dbname;
          var remoteDb = new PouchDB(url);
          localDB.sync(remoteDb);

        }

        $rootScope.login=function(){

          console.log('$rootScope.username', $rootScope.user.username)

            $rootScope.BASE_URL_AUTH = 'http://195.154.223.114:5984/test'
         
            var db = new PouchDB($rootScope.BASE_URL_AUTH);
            

            db.login($rootScope.user.username, $scope.user.password , function (err,response) {
              if (err) {
                if (err.name === 'unauthorized') {
                  $scope.error="Userame or Password incorrect";                }
                else {
                  $scope.error=err;
                }
              }
              else{

                console.log('Athenticated ', response);
                $rootScope.BASE_URL = 'http://'+$rootScope.user.username+':'+$scope.user.password+'@195.154.223.114:5984/';
                
                $rootScope.sync('users_replicat');
                $rootScope.sync('applications');

                $state.go("home");
              }



              
          });

        }
    }

    LoginCtrl.$inject = ["$q","$state","$rootScope","$scope", "$log","$location"];

    angular
        .module('app.login')
        .controller('LoginCtrl', LoginCtrl);

})();

(function () {
    'use strict';

    function LoginCtrl($q,$state, $rootScope, $scope, $log, $location, localStorageService) {
        var that = this;

        $rootScope.user ={};

        $rootScope.sync = function(dbname){
          var localDb = new PouchDB(dbname);
          var url = $rootScope.BASE_URL+dbname;
          var remoteDb = new PouchDB(url);
          
          localDb.sync(remoteDb, {
            live: true, 
            retry: true
          }).on('change', function (info) {
           })
          .on('paused', function () {
            // replication paused (e.g. user went offline)
            //$rootScope.$broadcast(dbname);
          }).on('active', function () {
            // replicate resumed (e.g. user went back online)
            $rootScope.$broadcast(dbname);
          }).on('denied', function (info) {
            // a document failed to replicate, e.g. due to permissions
          }).on('complete', function (info) {
            // handle complete
            $rootScope.$broadcast(dbname);
          }).on('error', function (err) {
            // handle error
            $rootScope.$broadcast(dbname);
          });

        }

        $rootScope.login=function(){

          console.log('$rootScope.username', $rootScope.user.username)

            $rootScope.BASE_URL_AUTH = 'http://195.154.223.114:5984/test'
         
            var db = new PouchDB($rootScope.BASE_URL_AUTH);
            

            db.login($rootScope.user.username, $scope.user.password , function (err,response) {
              if (err) {
                if (err.name === 'unauthorized') {
                  $scope.error="Userame or Password incorrect";                
                }else {
                  $scope.error=err;
                }
              }
              else{

                localStorageService.set("user", $rootScope.user);

                console.log('Athenticated ', response);
                $rootScope.BASE_URL = 'http://'+$rootScope.user.username+':'+$scope.user.password+'@195.154.223.114:5984/';
                
                $rootScope.sync('users_replicat');

                $rootScope.sync('applications');

                $state.go("home");

                
              }



              
          });

        }
    }

    LoginCtrl.$inject = ["$q","$state","$rootScope","$scope", "$log","$location", "localStorageService"];

    angular
        .module('app.login')
        .controller('LoginCtrl', LoginCtrl);

})();

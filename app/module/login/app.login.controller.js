(function () {
    'use strict';

    function LoginCtrl($q,$state, $rootScope, $scope, $log, $location) {
        var that = this;
        $scope.login=function(){
          var db = new PouchDB('http://'+this.username+':'+this.password+'@195.154.223.114:5984/_users');
            db.login(this.username, this.password , function (err,response) {
              if (err) {
                if (err.name === 'unauthorized') {
                  $scope.error="Userame or Password incorrect";                }
                else {

                  $scope.error=err;
                }
              }
              else{

                db.getSession(function (err, response) {
                if (err) {
                  alert("error network");
                } else if (!response.userCtx.name) {
                  $location.path("/login");
                } else {
                  db.getUser(response.userCtx.name, function (err, response) {
                    if (err) {
                      alert("error");
                    } else {
                      var db = new PouchDB('http://'+response.username+':'+response.password+'@195.154.223.114:5984/applications');
                      db.allDocs({
                        include_docs: true,
                        attachments: true
                      }).then(function (result) {
                        var rows=_.map(result.rows, 'doc');//pour avoir juste les document de la base de donne
                        var apps=_.reject(rows, function(value) {
                          return (_.indexOf(response.apps, value._id)==-1);
                        });
                        $rootScope.apps=apps;
                      }).catch(function (err) {
                        console.log("list client error");
                        console.log(err);
                      });
                    }
                  });
                }
                });
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

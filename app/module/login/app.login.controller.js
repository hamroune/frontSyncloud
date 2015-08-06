(function () {
    'use strict';

    function LoginCtrl($q,$state, $rootScope, $scope, $log, $location) {
        var that = this;
        $scope.login=function(){
          var db = new PouchDB('http://zahir:syncloud@195.154.223.114:5984/_users');
            db.login(this.username, this.password , function (err,response) {
              if (err) {
                if (err.name === 'unauthorized') {
                  $scope.error="Userame or Password incorrect";                }
                else {
                  $scope.error="Serveur is unreachable";
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

                      var db = new PouchDB('http://zahir:syncloud@195.154.223.114:5984/applications');
                      db.allDocs({
                        include_docs: true,
                        attachments: true
                      }).then(function (result) {
                        var rows=_.map(result.rows, 'doc');//pour avoir juste les document de la base de donne
                        var a=_.reject(rows, function(value) {
                          return (_.indexOf(response.apps, value._id)==-1);
                        });
                        console.log(a);
                        $rootScope.apps=a;
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

(function () {
    'use strict';

    function ApplicationService($q, $rootScope) {

    	var URL_APPLICATIONS = "applications";
    	var URL_USERS = "users_replicat";

    	var dbUsers = new PouchDB(URL_USERS);
    	var dbApplications = new PouchDB(URL_APPLICATIONS);

    	this.getCurrentUser = function(){
    		var currentUserName = "org.couchdb.user:"+$rootScope.user.username;
    		var defered  = $q.defer();

    		dbUsers.get(currentUserName).then(function (user) {
    			defered.resolve(user);
    		}, function(){
                defered.reject();
            });
        	return defered.promise;
    	}
        

        this.getApplication = function(){

        	var defered  = $q.defer();


        	defered.resolve([]);

        	return defered.promise;
        }

       

    }

    ApplicationService.$inject = ["$q", "$rootScope"];

    angular
        .module('app.dashboard')
        .service('ApplicationService', ApplicationService);

})();

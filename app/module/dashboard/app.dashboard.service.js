(function () {
    'use strict';

    function ApplicationService($q, $rootScope) {



        var self = this;

    	var URL_APPLICATIONS = "applications";
    	var URL_USERS = "users_replicat";

    	var dbUsers = new PouchDB(URL_USERS);
    	var dbApplications = new PouchDB(URL_APPLICATIONS);
        var LOCAL_BASE = cordova.file.applicationStorageDirectory+"Documents/WebApps/" ; //"cdvfile://localhost/persistent/Download/WebApps/";//


        this.sync = function(dbname){
          if($rootScope.synced){
                return;
          }
          $rootScope.BASE_URL = 'http://'+$rootScope.user.username+':'+$rootScope.user.password+'@195.154.223.114:5984/';
               
          var localDb = new PouchDB(dbname);
          var url = $rootScope.BASE_URL+dbname;
          var remoteDb = new PouchDB(url);
          
          localDb.sync(remoteDb, {
            live: true, 
            retry: true
          })
          .on('change', function (info) {
           })
          .on('paused', function () {
            // replication paused (e.g. user went offline)
            //$rootScope.$broadcast(dbname);
          }).on('active', function () {
            // replicate resumed (e.g. user went back online)
            $rootScope.$broadcast(dbname);
          }).on('denied', function (info) {
            // a document failed to replicate, e.g. due to permissions
             $rootScope.$broadcast(dbname);
          }).on('complete', function (info) {
            // handle complete
            $rootScope.$broadcast(dbname);
          }).on('error', function (err) {
            // handle error
            $rootScope.$broadcast(dbname);
          });

          $rootScope.synced = true;

        }

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

        this.getApplication = function(appId){

        	var defered  = $q.defer();

            var localDB = new PouchDB('applications'); 
            localDB.get(appId).then(function(docs){
                console.log('docs', docs);
                defered.resolve(docs);
            });

        	return defered.promise;
        }

        this.downloadZip = function (app){
            var defered  = $q.defer();
            var LOCAL_BASE = cordova.file.applicationStorageDirectory;//"cdvfile://localhost/persistent/Download/";
            var url = app.zipUrl;//celui de filepicker zipUrl/iconUrl
            var fileTransfer = new FileTransfer();
            var uri = encodeURI(url);
            var localFile = LOCAL_BASE+app.name;

            fileTransfer.download(
                            uri,  
                            localFile,
                            function(entry) {
                                console.log("download complete: " + entry.toURL());
                                app.nativeURL = entry.toNativeURL();

                                self.unzipFile(app, entry).then(function(){
                                    defered.resolve(entry);
                                });

                            },

                            function(error) {
                                console.log("download error source " + error.source);
                                console.log("download error target " + error.target);
                                console.log("upload error code" + error.code);

                                defered.reject();
                            }
                        );
            return defered.promise;
        }

        this.unzipFile = function(app, entry){
            var defered  = $q.defer();
            var outputDir = LOCAL_BASE+app.name+"/";

            var nativeURL = app.nativeURL;
            //Unzip the local Zip file

            zip.unzip(nativeURL, outputDir, function(result){
                    defered.resolve();
                  });
             return defered.promise;
        }

        this.openApp = function(app){
            window.open(LOCAL_BASE+app.name+"/index.html", '_self', 'localtion=yes');
        }

        this.downloadIcon = function(app){
            //from remote to local
            var defered  = $q.defer();

            //"cdvfile://localhost/persistent/Download/";
            var url = app.iconUrl;//celui de filepicker zipUrl/iconUrl
            var fileTransfer = new FileTransfer();
            var uri = encodeURI(url);
            var localFile = LOCAL_BASE+app.name+".png";

            fileTransfer.download(
                            uri,  
                            localFile,
                            function(entry) {
                                app.icon = entry.toNativeURL();

                                console.log("download Icon complete: " + entry.toURL(), 'app', app);

                                defered.resolve(app);

                            },

                            function(error) {
                                console.log("download error source " + error.source);
                                console.log("download error target " + error.target);
                                console.log("upload error code" + error.code);

                                defered.reject();
                            }
                        );
            return defered.promise;
        }


        this.getIcon = function(app){
            return LOCAL_BASE+app.name+".png";
        }

        this.isAppDownloaded = function(app){
            var defered  = $q.defer();
            //true vs false
            //alert('isAppDownloaded');

            window.resolveLocalFileSystemURL(LOCAL_BASE+app.name+"/", 
                function(){
                    defered.resolve(true);
            }, function(){
                    defered.resolve(false);
            });

            return defered.promise;
        }
       

    }

    ApplicationService.$inject = ["$q", "$rootScope"];

    angular
        .module('app.dashboard')
        .service('ApplicationService', ApplicationService);

})();
